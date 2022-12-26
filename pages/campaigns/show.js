import React from "react";
import campaignContract from "../../ethereum/campaign";
import Layout from "../../components/Layout";
import { Card, Grid, Button } from "semantic-ui-react";
import {Link} from '../../routes'
import web3 from "../../ethereum/web3";
import ContributeForm from "../../components/ContributeForm";

const campaignShow = ({address,balance,manager,minimumContribution,requestsCount,approversCount,})=>{

    const renderCards = ()=>{
        const items = [
            {
                header: manager,
                meta: "Address of Manager",
                description:
                  "The manager created this campaign and can create requests to withdraw money",
                style: { overflowWrap: "break-word" },
              },
              {
                header: minimumContribution,
                meta: "Minimum Contribution (wei)",
                description:
                  "You must contribute at least this much wei to become an approver",
              },
              {
                header: requestsCount,
                meta: "Number of Requests",
                description:
                  "A request tries to withdraw money from the contract. Requests must be approved by approvers",
              },
              {
                header: approversCount,
                meta: "Number of Approvers",
                description:
                  "Number of people who have already donated to this campaign",
              },
              {
                header: web3.utils.fromWei(balance, "ether"),
                meta: "Campaign Balance (ether)",
                description:
                  "The balance is how much money this campaign has left to spend.",
              },
          ];
      
        return <Card.Group items={items} />;
    }

    return(
        <Layout>
            <div>
                <h3>Campaign Show</h3>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={10}>
                            {renderCards()}
                        </Grid.Column>
                        <Grid.Column width={6}>
                            <ContributeForm address={address}/>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                            <Link route={`/campaigns/${address}/requests`}>
                                <Button primary>View Request</Button>
                            </Link>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </div>
        </Layout>
    );
}

campaignShow.getInitialProps = async (props) => {
    const address = props.query.address;
    const campaign = campaignContract(address);
    const summary = await campaign.methods.getSummary().call();
    return {
        address: address,
        minimumContribution: summary[0],
        balance: summary[1],
        requestsCount: summary[2],
        approversCount: summary[3],
        manager: summary[4]
    }
}

export default campaignShow;