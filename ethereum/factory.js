import web3 from "./web3";
import CampaignFactory from './build/CampaignFactory.json';

const address = '0x26e87e4893C440dDc73Db045297102072Fcc5171';

const contract =  new web3.eth.Contract(CampaignFactory.abi,address)

export default contract;