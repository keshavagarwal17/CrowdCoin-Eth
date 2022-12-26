import React, {useState} from "react";
import { Form, Input, Button, Message} from "semantic-ui-react";
import campaignContract from "../ethereum/campaign";
import web3 from "../ethereum/web3";
import {Router} from '../routes'

const ContributeForm = ({address})=>{
    const [value,setValue] = useState('');
    const [loading,setLoading] = useState(false);
    const [errMsg, setErrMsg] = useState('');

    const onSubmit = async(e)=>{
        e.preventDefault();
        setLoading(true);
        setErrMsg('');
        try {
            const campaign = campaignContract(address);
            const accounts = await web3.eth.getAccounts();
            await campaign.methods.contribute().send({
                from: accounts[0],
                value: web3.utils.toWei(value,'ether')
            })
            Router.replaceRoute(`/campaigns/${address}`)
        } catch (error) {
            setErrMsg(error.message);
        }
        setValue('');
        setLoading(false);
    }

    return (
        <Form onSubmit={onSubmit} error={!!errMsg}>
            <Form.Field>
                <label>Amount to Contribute</label>
                <Input value={value} onChange={(e) => setValue(e.target.value)} label="ether" labelPosition="right"></Input>
            </Form.Field>
            <Message error header="OOPS!" content={errMsg} />
            <Button loading={loading} primary>Contribute!</Button>
        </Form>
    );
}

export default ContributeForm;