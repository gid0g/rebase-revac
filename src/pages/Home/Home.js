import React, {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import api from '../../axios/custom';

const Home = () => {
  const token = sessionStorage.getItem("myToken");
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [logo, setLogo] = useState(null);
  const [organisationData, setOrganisationData] = useState([]);

  const organisationId = sessionStorage.getItem("organisationId");

  useEffect(() => {
    if (!organisationId || !token) {
      // You may want to handle this case if either `organisationId` or `token` is missing.
      return;
    }
  
    api
      .get(`organisation/${organisationId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setOrganisationData(response.data);
        const logoUrl = `data:image/png;base64,${response.data.logoData}`;
        const backgroundLogo = `data:image/png;base64,${response.data.backgroundImagesData}`;
        setLogo(logoUrl);
        setBackgroundImage(backgroundLogo);
        sessionStorage.setItem('organisationdata', response.data.organisationName);

        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [organisationId, token]);
  


  return (
    <>
      <div className="mb-3 flex justify-content-between">
        <div className=" ">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/home/Dashboard">Home</Link>
            </li>
          </ol>
        </div>
        <h2>{organisationData.organisationName}</h2>

        <div className=" items-center	 gap-3 flex flex-row-reverse">
          <div className="">
          <img src={logo} style={{height:'80px'}}alt="" />
          </div>
          <div className="">

          </div>
        </div>
      </div>
      <div className="mt-1 shadow-md p-2">
        <div className="grid gap-3 p-3">
          <div className="grid-col-6">
                 <img style={{height:'450px', width:'100%', objectFit:'cover'}} src={backgroundImage} alt="" />
          </div>
        </div>
      </div>
    </>
  )
}

export default Home;
