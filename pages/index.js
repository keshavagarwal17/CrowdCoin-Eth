import React, { useEffect } from 'react';
import { Card, Button } from 'semantic-ui-react';
import factory from '../ethereum/factory'
import Layout from '../components/Layout'
import {Link} from '../routes'


const Index = ({campaigns})=>{
    const renderCampaign = ()=>{
        const items = campaigns.map(address => {
            return {
                header: address,
                description: <Link route={`campaigns/${address}`}>View Campaign</Link>,
                fluid: true
            }
        })
        return <Card.Group items = {items} />
    }
    return (
        <Layout>
            <div>
                <h3>Open Campaign</h3>
                <Link route="campaigns/new">
                    <Button floated="right" content="Create Campaign" icon="add circle" primary />
                </Link>
                {renderCampaign()}
            </div>
        </Layout>
    )
};

Index.getInitialProps = async (ctx) => {
    const campaigns = await factory.methods.getDeployedCampaigns().call();
    return { campaigns }
}

export default Index;