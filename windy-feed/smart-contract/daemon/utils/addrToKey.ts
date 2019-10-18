
import { ethers } from 'ethers';

export default function(addr: string) : string
{
	return ethers.utils.hexZeroPad(addr, 32).toString().toLowerCase();
}