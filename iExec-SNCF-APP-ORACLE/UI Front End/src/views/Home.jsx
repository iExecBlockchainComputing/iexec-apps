import React, { useState, useEffect } from "react";
import { useContractLoader } from "../hooks";
import HorizontalDivider from "../assets/HorizontalDivider.png";
import TakeOffIcon from "../assets/TakeOffIcon.png";
import { Button, InputNumber, notification } from "antd";
import { parseEther, formatEther } from "@ethersproject/units";
import { useContractReader } from "../hooks";
import { IPFS_GATEWAY_URL,ACK_KEY,CUSTOM_WORKERPOOL_MAP,PROVIDER_ENDPOINT_MAP,ORACLE_CID,CUSTOM_WORKERPOOL_MA } from "../constants";

import { IExecOracleFactory, utils } from '../dist';
import { ethers } from "ethers";
import moment from 'moment';
import timezone from 'moment-timezone';


export default function Home({
  address,
  readProvider,
  writeProvider,
  contracts,
  tx,
}) {
  const contractsw = useContractLoader(writeProvider);
  const [BetValue, setBetValue] = useState("");
  const [GareDepartCode, setGareDepartCode] = useState("");
  const [GareDepart, setGareDepart] = useState("");
  const [GareArriveeCode, setGareArriveeCode] = useState("");
  const [GareArrivee, setGareArrivee] = useState("");
  const [DepartueTime, setDepartueTime] = useState("");
  const [ArrivalTime, setArrivalTime] = useState("");
  const [VehiculeId, setVehiculeId] = useState("");
  const [TripId, setTripId] = useState("");
  const [LineId, setLineId] = useState("");
  let [BetOpen, setBetOpenValue] = useState(true);

 
  
 const delayStatus = {
    "NO_SERVICE":"NO_SERVICE",
    "REDUCED_SERVICE":"REDUCED_SERVICE",
    "SIGNIFICANT_DELAYS":"SIGNIFICANT_DELAYS",
    "DETOUR":"DETOUR",
    "ADDITIONAL_SERVICE":"ADDITIONAL_SERVICE",
    "MODIFIED_SERVICE":"MODIFIED_SERVICE",
    "OTHER_EFFECT":"OTHER_EFFECT",
    "UNKNOWN_EFFECT":"UNKNOWN_EFFECT",
    "STOP_MOVED":"STOP_MOVED"
 } 

  const NumOfPlayers = useContractReader(
    contracts,
    "TrainBetting",
    "getNumberOfPlayers"
  );
  const AmountForAsPlanned = useContractReader(
    contracts,
    "TrainBetting",
    "getAmountBetsOnAsPlanned"
  );
  const AmountForCanceled = useContractReader(
    contracts,
    "TrainBetting",
    "getAmountBetsOnCanceled"
  );
  
  const DepartureTimeContract = useContractReader(
    contracts,
    "TrainBetting",
    "getDepartureTime"
  );
  const Status = useContractReader(contracts, "TrainBetting", "getStatus");
  const StatusTrain = useContractReader(contracts, "TrainBetting", "getTrainStatus");
  
  const signer = utils.getSignerFromPrivateKey(
    PROVIDER_ENDPOINT_MAP[133],
    ACK_KEY,
  );
  const factory = new IExecOracleFactory(signer, {
    ipfsGateway: IPFS_GATEWAY_URL,
  });

  const handleBetAsPlanned = async () => {
    if (BetValue) {
      const val = parseEther(BetValue.toString());
      tx(
        contractsw.TrainBetting.bet(1, {
          gasPrice: 0,
          gasLimit: 737679,
          value: val,
        })
      );
    } else {
      notification.info({
        message: "Put in some xRLC",
        description: "Enter a valid input",
        placement: "bottomRight",
      });
    }
  };
  const handleBetCanceled = async () => {
    if (BetValue) {
      const val = parseEther(BetValue.toString());
      tx(
        contractsw.TrainBetting.bet(2, {
          gasPrice: 0,
          gasLimit: 737679,
          value: val,
        })
      );
    } else {
      notification.info({
        message: "Put in some xRLC",
        description: "Enter a valid input",
        placement: "bottomRight",
      });
    }
  };
  const handleClaimPrize = async () => {
  
          factory.updateOracle(ORACLE_CID, {
        workerpool: CUSTOM_WORKERPOOL_MA,
      })  .subscribe({
    error: (e) => console.error(e),
    next: (value) => {
      const { message, ...additionalEntries } = value;
      console.log(message);
      console.info(JSON.stringify(additionalEntries));
    },
    complete: () => {
      console.log('Update task completed!');
          if (Status !== "active") {
      tx(
        contractsw.TrainBetting.distributePrizes({
          gasPrice: 0,
          gasLimit: 737679,
        })
      );
      setBetOpenValue(true);
    } else {
      notification.info({
        message: "Flight Still Scheduled",
        description: "wait until the flight has departed or canceled",
        placement: "bottomRight",
      });
    }
    },
  });  


  };
  const handleUpdateStatus = async () => {
  
	     fetch(`https://api.navitia.io/v1/journeys?from=stop_area:RAT:SA:STLAZ&to=stop_area:RAT:SA:GDLYO&datetime=${DepartureTimeContract}&data_freshness=realtime`,{
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': '3b036afe-0110-4202-b9ed-99718476c2e0',

        }  })
      .then(res => res.json())
      .then(json =>{        

        moment.tz.add('Europe/Paris|CET CEST CEMT|-10 -20 -30');
        let pr = moment().tz('Europe/Berlin').format("YYYYMMDDTHHmmss"); 
        let isAfter = moment(pr).isAfter(json.journeys[0].arrival_date_time);
        let delay = json.journeys[0].status;
                               
        if(isAfter || delay === delayStatus[delay]){
        	setBetOpenValue(false);
        	if(delayStatus[delay])
        	{
        	tx(
                 	contractsw.TrainBetting.setTrainStatus("delay", {
          		gasPrice: 0,
          		gasLimit: 737679          
        		})
                  );
        	}else
        	{
        	tx(
                 	contractsw.TrainBetting.setTrainStatus("arrive", {
          		gasPrice: 0,
          		gasLimit: 737679          
        		})
                  );
        	}
        }

       
        
      } );
  };


   
   const trainDepart = async ()=>{
      
     fetch(`https://api.navitia.io/v1/journeys?from=stop_area:RAT:SA:STLAZ&to=stop_area:RAT:SA:GDLYO&datetime=${DepartureTimeContract}&data_freshness=realtime`,{
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': '3b036afe-0110-4202-b9ed-99718476c2e0',

        }  })
      .then(res => res.json())
      .then(json =>{
        setGareDepart(json.journeys[0].sections[0].from.name);
        setGareDepartCode(json.journeys[0].sections[0].from.stop_area.codes[0].value);
        setGareArriveeCode(json.journeys[0].sections[1].to.stop_point.codes[0].value);
        setGareArrivee(json.journeys[0].sections[1].to.name);
        setDepartueTime(json.journeys[0].sections[0].departure_date_time);
        setArrivalTime(json.journeys[0].sections[1].arrival_date_time);
        setLineId(json.journeys[0].sections[1].links[1].id);
        
        

        moment.tz.add('Europe/Paris|CET CEST CEMT|-10 -20 -30');
        let pr = moment().tz('Europe/Berlin').format("YYYYMMDDTHHmmss"); 
        
        let isAfter = moment(pr).isAfter(json.journeys[0].arrival_date_time);
       
        if(isAfter) setBetOpenValue(false);   
  
        
      } );
 }



 const _departureTime = DepartueTime?moment(DepartueTime):'';
 const _arrivalTime = ArrivalTime?moment(ArrivalTime):'';
 const duration = (_arrivalTime && _departureTime)?moment.duration(_arrivalTime.diff(_departureTime)):'';

  useEffect(() => {    
  trainDepart();
  });

   
  return (



    <div
      className="container"
      style={{
        width: "70%",
      }}
    >
      <div className="container-table row-fluid">
        <div className="span4 flight-column animated fadeInDown">
          <div className="banner">
            <h3 className="firsttitle">Sncf Pronostics</h3>
            <div className="status">
              Status: {StatusTrain ? StatusTrain.toString().toUpperCase() : <p></p>}
            </div>
            <div className="status">
              <Button
                className="statusbutton"
                style={{ width: "180px", height: "30px" }}
                onClick={handleUpdateStatus} 
              >
                Update Status
              </Button>
            </div>
          </div>
          <div className="flightResults-wrapper">
            <div className="card shadow-none flight-card-lg">
              <div className="row border-bottom pb-1">
                <div className="col-12 d-flex inline justify-content-between">
                  <div className="d-flex flex-column">
                    <span className="trip-locations"> {GareDepart} to {GareArrivee}</span>
                  </div>
                  <div className="price text-primary d-flex  align-items-center">
                    {(Status==="close")?
                    <Button
                      className="button-ps"
                      style={{ width: "250px" }}
                      onClick={handleClaimPrize}
                    >
                      Claim Prize
                    </Button>:""}
                  </div>
                </div>
              </div>
              <div className="row border-bottom mt-3 pb-3">
                <div className="col-3 d-flex flex-column">
                  <div className="d-flex justify-content-start">
                    <span className="time">Departure</span>
                  </div>
                  <span className="time">{DepartueTime?moment(DepartueTime).format('HH:mm:ss'):''}</span>
                  <div className="date">{DepartueTime?moment(DepartueTime).format('DD'):''}/{DepartueTime?moment(DepartueTime).format('MM'):''}/{DepartueTime?moment(DepartueTime).format('YYYY'):''}</div>
                  <div className="location-details">{GareDepartCode}</div>
                </div>
                <div className="col-6 middle-col">
                  <img src={TakeOffIcon} className="height-45" alt="plane" />
                  <div className="detail-text mt-1">Duration: {duration?duration.asMinutes():''} minutes </div>
                  <img
                    src={HorizontalDivider}
                    className="horizontal-divider height-45"
                    alt="divider"
                  />

                  <div className="detail-text">{LineId}</div>
                </div>
                <div className="col-3 d-flex flex-column">
                  <div className="d-flex justify-content-start">
                    <span className="time">Arrival</span>
                  </div>
                  <span className="time">{ArrivalTime?moment(ArrivalTime).format('HH:mm:ss'):''}</span>
                  <div className="date">{ArrivalTime?moment(ArrivalTime).format('DD'):''}/{ArrivalTime?moment(ArrivalTime).format('MM'):''}/{ArrivalTime?moment(ArrivalTime).format('YYYY'):''}</div>
                  <div className="location-details">{GareArriveeCode}</div>
                </div>
              </div>
              <div className="row">
                <div className="col-12 d-flex justify-content-center">
                  <InputNumber
                    className="inputbet"
                    style={{
                      outline: "none",
                      boxshadow: "2px 0px 5px #FFD90F",
                    }}
                    onChange={(e) => {
                      setBetValue(e);
                    }}
                    value={BetValue}
                    type="number"
                    min="0.000001"
                    placeholder="Minimum: 0.001 xRLC"
                  />
                </div>
              </div>
              <div className="row" style={{ marginTop: 20 }}>
                <div className="col-12 d-flex justify-content-center">
                  {(BetOpen)?<Button
                    className="action bet"
                    style={{ width: "300px" }}
                    onClick={handleBetAsPlanned}
                  >
                    I believe the train will be on time
                  </Button>:<Button
                    className="action bet"
                    style={{ width: "300px" }}
                    onClick={handleUpdateStatus} 
                  >
                    Click to Update Status 
                  </Button>}
                </div>
                <div
                  className="col-12 d-flex justify-content-center"
                  style={{ marginTop: 20 }}
                >
                  {(BetOpen)?<Button
                    className="action bet"
                    style={{ width: "300px" }}
                    onClick={handleBetCanceled}
                  >
                    I believe the train will be delayed or late!
                  </Button>:''}
                </div>
                <div
                  className="col-12 d-flex justify-content-center"
                  style={{ marginTop: 20 }}
                >
                  <span className="trip-locations">
                    {" "}
                    Number of Players:{" "}
                    {NumOfPlayers ? NumOfPlayers.toNumber() : 0}
                  </span>
                </div>
                <div
                  className="col-12 d-flex justify-content-center"
                  style={{ marginTop: 20 }}
                >
                  <span className="trip-locations">
                    Amount for Takeoff as planned:
                    {AmountForAsPlanned
                      ? formatEther(AmountForAsPlanned)
                      : 0}{" "}
                    xRLC{" "}
                  </span>
                </div>
                <div
                  className="col-12 d-flex justify-content-center"
                  style={{ marginTop: 20 }}
                >
                  <span className="trip-locations">
                    Amount for canceled or diverted:
                    {AmountForCanceled
                      ? formatEther(AmountForCanceled)
                      : 0}{" "}
                    xRLC{" "}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
