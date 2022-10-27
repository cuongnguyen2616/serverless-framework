import { CfnOutput, Construct, Stack, StackProps } from "@aws-cdk/core";
import { Vpc, SubnetType } from "@aws-cdk/aws-ec2";
import { CfnDBCluster, CfnDBSubnetGroup } from "@aws-cdk/aws-rds";
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class RDSInstance extends Stack {
  constructor(
    scope: Construct,
    id: string,
    deploymentStage: string,
    props?: StackProps
  ) {
    super(scope, id, props);

    // create VPC
    const vpc = new Vpc(this, "Vpc", {
      cidr: "10.0.0.0/16",
      natGateways: 0,
      subnetConfiguration: [
        { name: "aurora_isolated_", subnetType: SubnetType.PRIVATE_ISOLATED },
      ],
    });
    //get subnets ids from vpc
    const subnetIds: string[] = [];
    vpc.isolatedSubnets.forEach((subnet) => {
      subnetIds.push(subnet.subnetId);
    });
    //print the subnet ids
    new CfnOutput(this, "VpcSubnetsIds", {
      value: JSON.stringify(subnetIds),
    });
    // print the securitygroup
    new CfnOutput(this, "VpcDefaultSecurityGroup", {
      value: vpc.vpcDefaultSecurityGroup,
    });

    //create subnetgroup
    const dbSubnetGroup: CfnDBSubnetGroup = new CfnDBSubnetGroup(
      this,
      "AuroraSubnetGroup",
      {
        dbSubnetGroupDescription: "Subnet group to access aurora",
        dbSubnetGroupName: "aurora-sls-subnet-group",
        subnetIds,
      }
    );

    //create aurora dbb serverless instance
    const aurora = new CfnDBCluster(this, "AuroraServerlessCdk", {
      databaseName: "pocdb",
      dbClusterIdentifier: "aurora-sls",
      engine: "aurora",
      engineMode: "serverless",
      enableHttpEndpoint: true, //data api,
      masterUsername: "master",
      masterUserPassword: "Password!23",
      port: 3306,
      dbSubnetGroupName: dbSubnetGroup.dbSubnetGroupName,
      scalingConfiguration: {
        autoPause: true,
        maxCapacity: 2,
        minCapacity: 2,
        secondsUntilAutoPause: 3600,
      },
    });
    //wait for subnet group to be created
    aurora.addDependsOn(dbSubnetGroup);

    // construct arn from available information
    const account = props?.env?.account;
    const region = props?.env?.region;

    const auroraArn = `arn:aws:rds:${region}:${account}:cluster:${aurora.dbClusterIdentifier}`;
    new CfnOutput(this, "AuroraClusterArn", {
      exportName: `${deploymentStage}`,
      value: auroraArn,
    });
  }
}
