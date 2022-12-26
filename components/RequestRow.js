import React,{useState} from 'react';
import { Table, Button } from 'semantic-ui-react';
import web3 from '../ethereum/web3';
import campaignContract from '../ethereum/campaign';

const RequestRow = ({id,request,address,approversCount,account,manager})=>{
    const {Row,Cell} = Table;
    const [loadingApprovalBtn,setLoadingApprovalBtn] = useState(false);
    const [loadingFinalizeBtn,setLoadingFinalizeBtn] = useState(false);

    const readyToFinalize = (request.approvalCount*2 >= approversCount);

    const onApprove = async()=>{
        setLoadingApprovalBtn(true);
        try {
            const accounts = await web3.eth.getAccounts();
            const campaign = campaignContract(address);
            await campaign.methods.approveRequest(id).send({
                from: accounts[0]
            })
        } catch (error) {
            
        }
        setLoadingApprovalBtn(false);
    }

    const onFinalize = async()=>{
        setLoadingFinalizeBtn(true);
        try {
            const accounts = await web3.eth.getAccounts();
            const campaign = campaignContract(address);
            await campaign.methods.finalizeRequest(id).send({
                from: accounts[0]
            })
        } catch (error) {
            
        }
        setLoadingFinalizeBtn(false);
    }

    return (
        <Row disabled={request.complete} positive={!request.complete && readyToFinalize}>
            <Cell>{id + 1}</Cell>
            <Cell>{request.description}</Cell>
            <Cell>{web3.utils.fromWei(request.value,'ether')}</Cell>
            <Cell>{request.recipient}</Cell>
            <Cell>{request.approvalCount} / {approversCount}</Cell>
            <Cell>
                {
                    request.complete ? null : 
                    <Button color='green' basic onClick={onApprove} loading={loadingApprovalBtn}>Approve</Button>
                }
            </Cell>
            {(account != manager)?<></>:<Cell>
                {
                    request.complete ? null : 
                    <Button color='teal' disabled={!readyToFinalize} basic onClick={onFinalize} loading={loadingFinalizeBtn}>Finalize</Button>
                }
            </Cell>}
            <Cell></Cell>
        </Row>
    );
}

export default RequestRow;