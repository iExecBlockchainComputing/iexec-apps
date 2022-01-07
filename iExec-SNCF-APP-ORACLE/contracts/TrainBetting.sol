// SPDX-License-Identifier: Apache-2.0

/******************************************************************************
 * Copyright 2021 IEXEC BLOCKCHAIN TECH                                       *
 *                                                                            *
 * Licensed under the Apache License, Version 2.0 (the "License");            *
 * you may not use this file except in compliance with the License.           *
 * You may obtain a copy of the License at                                    *
 *                                                                            *
 *     http://www.apache.org/licenses/LICENSE-2.0                             *
 *                                                                            *
 * Unless required by applicable law or agreed to in writing, software        *
 * distributed under the License is distributed on an "AS IS" BASIS,          *
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.   *
 * See the License for the specific language governing permissions and        *
 * limitations under the License.                                             *
 ******************************************************************************/

pragma solidity ^0.5.16;

contract Oracle {

    function getString(bytes32) public view returns (string memory, uint256);
}

contract TrainBetting {
    
    uint256 public updatedate;
    string public status;
    string public trainstatus;
    string constant ONTIME = "on time";
    string constant LATE = "delayed";
    string constant ACTIVE = "active";
    string constant CLOSE = "close"; 
    uint256 public minimumBet;
    string public departureTime;        
    uint256 public totalBetsOnTime;
    uint256 public totalBetsOnLate;
    address payable [] public players;    

    struct Player {
        uint256 amountBet;
        uint16 betSelection;
    }
    
    // The address of the player and => the user info
    mapping(address => Player) public playerInfo;

    constructor() public {
        minimumBet = 1;
        status = CLOSE;
        trainstatus = ONTIME;
        getOracleData();
    }

    function checkPlayerExists(address player) public view returns (bool) {
        for (uint256 i = 0; i < players.length; i++) {
            if (players[i] == player) return true;
        }
        return false;
    }

    function bet(uint8 _betSelection) public payable {
        //The first require is used to check if the player already exist
        require(!checkPlayerExists(msg.sender), "player exist");
        //The second one is used to see if the value sended by the player is
        //Higher than the minimum value
        require(
            msg.value >= minimumBet,
            "Value must be more than the minimum bet"
        );

        //We set the player informations : amount of the bet and selected team
        playerInfo[msg.sender].amountBet = msg.value;
        playerInfo[msg.sender].betSelection = _betSelection;

        //Then we add the address of the player to the players array
        players.push(msg.sender);

        //At the end, we increment the stakes of the selected bet either bet on onscheduled or on canceled with the player bet
        if (_betSelection == 1) {
           totalBetsOnTime += msg.value;
        } else {
            totalBetsOnLate += msg.value;
        }
    }

    function distributePrizes() public {
        //Getting flight status from the oracle
        
        //Require to check whether the Flight is still scheduled or not
        require(
            !(keccak256(abi.encodePacked(status)) ==
                keccak256(abi.encodePacked(ACTIVE))),
            "Journey Still Active"
        );

        uint16 winnerpartselected;
        //We test if the current status is a win for the first selection or the second selection
        //So if the status is active or landed this means the flight took off as planned(first selection wins)
        //else the flight was canceled or diverted(second slection wins).
        if (
            (keccak256(abi.encodePacked(status)) ==
                keccak256(abi.encodePacked(CLOSE))) &&
            (keccak256(abi.encodePacked(trainstatus)) ==
                keccak256(abi.encodePacked(ONTIME)))
        ) {
            winnerpartselected = 1;
        } else {
            winnerpartselected = 2;
        }

        address payable [1000] memory winners;
        uint256 count = 0; // This is the count for the array of winners
        uint256 LoserBet = 0; //This will take the value of all losers bet
        uint256 WinnerBet = 0; //This will take the value of all winners bet
        address payable playerAddress = address(0);

        //We loop through the player array to check who selected the winner team
        for (uint256 i = 0; i < players.length; i++) {
            playerAddress = players[i];

            //If the player selected the winner bet
            //We add his address to the winners array
            if (playerInfo[playerAddress].betSelection == winnerpartselected) {
                winners[count] = playerAddress;
                count++;
            }
        }

        //We define which bet sum is the Loser one and which one is the winner
        if (winnerpartselected == 1) {
            LoserBet  = totalBetsOnLate;
            WinnerBet = totalBetsOnTime;
        } else {
            LoserBet  = totalBetsOnTime;
            WinnerBet = totalBetsOnLate;
        }

        //We loop through the array of winners, to give RLC to the winners
        for (uint256 j = 0; j < count; j++) {
            if (winners[j] != address(0)) {
                address add = winners[j];
                uint256 Bet = playerInfo[add].amountBet;
                //Transfer the money to the user
               // address payable addruser = payable(address(winners[j]));
                winners[j].transfer(
                    (Bet * (10000 + ((LoserBet * 10000) / WinnerBet))) / 10000
                );
            }
        }
        // Delete all the players
        for (uint256 i = 0; i < players.length; i++) {
            delete playerInfo[players[i]];
        }
        // Delete all the players array
        players = new address payable [](0);
        //reinitialize the bets
        LoserBet = 0;
        WinnerBet = 0;
        totalBetsOnTime = 0;
        totalBetsOnLate = 0;
        
        getOracleData();
    }

    function getOracleData() public returns (string memory) {
    
        if (
            (keccak256(abi.encodePacked(status)) ==
                keccak256(abi.encodePacked(ACTIVE)))
                
             ){
               return departureTime;
             }else{
        
        bytes32 oracleId = 0xcc69180e8ef042e4dc1fa0a4d61ce70de4c66af2e1f6c94a5cfe1dbd47ba2a2f;
        address oracleAddress = 0x8ecEDdd1377E52d23A46E2bd3dF0aFE35B526D5F;
        Oracle oracleContract = Oracle(oracleAddress);
        (string memory value, uint256 date) = oracleContract.getString(
            oracleId
        );
        departureTime = value;
        status = ACTIVE;
        updatedate = date;
        return value;}
    }

    function getStatus() public view returns (string memory) {
        return status;
    }
    
    function getAmountBetsOnTime() public view returns (uint256) {
        return totalBetsOnTime;
    }

    function getAmountBetsOnLate() public view returns (uint256) {
        return totalBetsOnLate;
    }

    function getNumberOfPlayers() public view returns (uint256) {
        return players.length;
    }
    
    //***//

    function getDepartureTime() public view returns (string memory)  {
        return departureTime;
    }
    
    function getTrainStatus() public view returns (string memory) {
        return trainstatus;
    }
    
    function setTrainStatus(string memory _trainstatus) public {
        
        if(keccak256(bytes(_trainstatus)) == keccak256(bytes("delay"))){
 		status = CLOSE;
 		trainstatus = LATE;
 		}
 	if(keccak256(bytes(_trainstatus)) == keccak256(bytes("arrive"))){
 		status = CLOSE;
 		trainstatus = ONTIME;
 		}
    }    
}
