import React,{useState,useEffect} from "react";
import Layout from "../../../components/Layout";
import { Button, Table } from "semantic-ui-react";
import {Link} from '../../../routes';
import web3 from "../../../ethereum/web3";
import campaignContract from "../../../ethereum/campaign";
import RequestRow from "../../../components/RequestRow";

const RequestIndex = ({address,requests,requestCount,approversCount,manager})=>{
    const {Header,Row,HeaderCell,Body} = Table;
    const [account,setAccount] = useState('');

    const fetchAccount = async()=>{
        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]);
    }

    useEffect(()=>{
        fetchAccount();
    },[])

    const renderRows = ()=>{
        return requests.map((request,index)=>{
            return <RequestRow key={index} account={account} manager={manager} id={index} request={request} address={address} approversCount={approversCount}/>
        })
    }

    return (
        <Layout>
            <div>
                <h3>Requests</h3>
                {(account == manager) ? 
                <Link route={`/campaigns/${address}/requests/new`}>
                    <Button floated="right" style={{marginBottom: 10}} primary>Add Request</Button>
                </Link> 
                : 
                <></>
                }
                <Table>
                    <Header>
                        <Row>
                            <HeaderCell>ID</HeaderCell>
                            <HeaderCell>Description</HeaderCell>
                            <HeaderCell>Amount</HeaderCell>
                            <HeaderCell>Recipient</HeaderCell>
                            <HeaderCell>Approval Count</HeaderCell>
                            <HeaderCell>Approve</HeaderCell>
                            {(account != manager)?<></>:<HeaderCell>Finalize</HeaderCell>}
                        </Row>
                    </Header>
                    <Body>
                        {renderRows()}
                    </Body>
                </Table>
                <div>Found {requestCount} requests.</div>
            </div>
        </Layout>
    );
}

RequestIndex.getInitialProps = async (props) => {
    const address = props.query.address;
    const campaign = campaignContract(address);
    const requestCount = await campaign.methods.getRequestsCount().call();
    const approversCount = await campaign.methods.approversCount().call();
    const manager = await campaign.methods.manager().call();

    const requests = await Promise.all(
        Array(parseInt(requestCount))
            .fill()
            .map((element,index)=>{
                return campaign.methods.requests(index).call();
            })
    )
    return {
        address,requests,requestCount,approversCount,manager
    }
}

export default RequestIndex;