import React,{useState} from "react";
import Layout from "../../../components/Layout";
import { Form, Button, Message, Input } from "semantic-ui-react";
import {Router, Link} from '../../../routes'
import campaignContract from "../../../ethereum/campaign";
import web3 from "../../../ethereum/web3";

const RequestNew = ({address})=>{
    const [state,setState] = useState({
        value:'',
        description: '',
        recipient: '',
        loading: false,
        errMsg: ''
    });

    const onSubmit = async(e) =>{
        e.preventDefault();
        setState({
            ...state,
            loading: true,
            errMsg: ''
        })
        try {
            const contract = campaignContract(address);
            const accounts = await web3.eth.getAccounts();
            await contract.methods.createRequest(state.description,web3.utils.toWei(state.value,'ether'),state.recipient).send({
                from: accounts[0]
            })
            Router.pushRoute(`/campaigns/${address}/requests`)
        } catch (error) {
            setState({
                ...state,
                errMsg: error.message
            })
        }
        setState({
            ...state,
            loading: false
        })
    }

    return (
        <Layout>
            <div>
                <Link route={`/campaigns/${address}/requests`}>Back</Link>
                <h3>Create a Request</h3>
                <Form onSubmit={onSubmit} error={!!state.errMsg}>
                    <Form.Field>
                        <label>Description</label>
                        <Input value = {state.description} onChange={(e)=>setState({...state,description:e.target.value})}/>
                    </Form.Field>
                    <Form.Field>
                        <label>Value in Ether</label>
                        <Input value = {state.value} onChange={(e)=>setState({...state,value:e.target.value})}/>
                    </Form.Field>
                    <Form.Field>
                        <label>Recipient</label>
                        <Input value = {state.recipient} onChange={(e)=>setState({...state,recipient:e.target.value})}/>
                    </Form.Field>
                    <Message error header="OOPS!" content={state.errMsg} />
                    <Button loading={state.loading} primary>Create !</Button>
                </Form>
            </div>
        </Layout>
    );
}

RequestNew.getInitialProps = async (props) => {
    const address = props.query.address;
    return {
        address
    }
}

export default RequestNew;