import React,{useState} from "react";
import { Form , Button, Input, Message} from "semantic-ui-react";
import Layout from "../../components/Layout";
import web3 from "../../ethereum/web3";
import factory from '../../ethereum/factory';
import {Router} from '../../routes'

const CampaignNew = ()=>{
    const [minimumContribution, setMinimumContribution] = useState('');
    const [errMsg, setErrorMsg] = useState('');
    const [loading,setLoading] = useState(false);

    const onSubmit = async(e)=>{
        e.preventDefault();
        setLoading(true);
        setErrorMsg('');
        try {
            const accounts = await web3.eth.getAccounts();
            await factory.methods.createCampaign(minimumContribution).send({
                from: accounts[0]
            })
            Router.pushRoute('/');
        } catch (error) {
            setErrorMsg(error.message);
        }
        setLoading(false);
    }

    return (
        <Layout>
            <h3>Create New Campaign</h3>
            <Form onSubmit={onSubmit} error={!!errMsg}>
                <Form.Field>
                    <label>Minimum Contribution</label>
                    <Input 
                        value={minimumContribution}
                        onChange={(e) => setMinimumContribution(e.target.value)}
                        label="Wei" 
                        labelPosition="right"
                    />
                </Form.Field>
                <Message error header="OOPS!" content={errMsg} />
                <Button loading={loading} primary>Create !</Button>
            </Form>
        </Layout>
    );
}

export default CampaignNew;