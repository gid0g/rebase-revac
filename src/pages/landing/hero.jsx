import React from "react";
import { Link } from "react-router-dom";
// import phone from "../../assets/images/phone2.webp";
// import building from "../../assets/images/building.png";
import city from "../../assets/images/Mask group (2).png"
import seller from "../../assets/images/Mask group.png"
import man from "../../assets/images/Mask group (1).png"
import bank from "../../assets/images/bank.png"
import comboshape from "../../assets/images/Combo shape.png"
import arrowup from "../../assets/images/Vector 64.png"
import arrowdown from "../../assets/images/Vector 65.png"


const Hero = () => {
  return (
    <>
      <section className="container">
        <div className="row">
          <div className="col-md-7 pt-5  mt-5 h-full ">
            <h1 className="landing_heading font-weight-bold text-black">
              Enumeration, Billing, Payment &{" "}
              <span className="text-primary font-weight-bold">
                Report Management Application
              </span>{" "}
            </h1>
            <h6 className="landing-paragraph text-black  mb-5 fs-4 lh-base">
              Harmonize Your Financial Journey, 
              Navigate Bills with <br /> Confidence and 
              Clarity From Payment Precision to <br />
              Enumeration Excellence. 
            </h6>
            <Link
                to="/register"
                className="text-lg px-3 py-2 mr-2 border-1 text-decoration-none 
                rounded font-normal leading-6 text-white border-black bg-black
                "
              >
                Sign Up
            </Link>
          </div>
          <div className="col-md-5 ">
            {/* Carousel for small devices */}
            
            <div className="d-md-none mt-5"> {/* Hide on medium and larger devices */}
              <div id="carouselExample" className="carousel slide" data-bs-ride="carousel">
                <div className="carousel-inner">
                  <div className="carousel-item active">
                    <img src={seller} className="d-block w-100" style={{height:'270px', width:'200px'}} alt="Seller" />
                  </div>
                  <div className="carousel-item">
                    <img src={man} className="d-block w-100" style={{height:'270px', width:'200px'}} alt="Man" />
                  </div>
                  <div className="carousel-item">
                    <img src={city} className="d-block w-100" style={{height:'270px', width:'200px'}} alt="City" />
                  </div>
                </div>
                <a className="carousel-control-prev" href="#carouselExample" role="button" data-bs-slide="prev">
                  <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                  <span className="visually-hidden">Previous</span>
                </a>
                <a className="carousel-control-next" href="#carouselExample" role="button" data-bs-slide="next">
                  <span className="carousel-control-next-icon" aria-hidden="true"></span>
                  <span className="visually-hidden">Next</span>
                </a>
              </div>
            </div>
            {/* Original layout */}
            <div className=" landing-pictures row pt-5 mt-5">
              <div className="col-md-5 text-center">
                <div className="mb-2">
                  <img src={seller} style={{height:'210px'}} alt="img"/>
                </div>
                <div>
                  <img src={man} style={{height:'210px'}} alt="img"/>              
                </div>
              </div>
              <div className="col-md-7 city_image">
                <img src={city} style={{height:'420px'}} alt="img"/>
              </div>
            </div>
          </div>
          <p
           className="safe-reliable border-1 rounded-2 py-2  border-0 " style={{color:'#3AB74E'}}>
           <img src={comboshape} style={{height:'18px', width:'18px', marginRight:'2px'}} alt="img"/>
            Safe & Reliable
        </p>
        <p
           className="easy-transactions border-1 rounded-2 py-2  border-0 ">
            <img src={bank} style={{height:'18px', width:'18px', marginRight:'2px'}} alt="img"/>
            Easy Transactions
        </p>
        <img src={arrowup}
            className="arrowup" 
            alt="img"
        />
        <img src={arrowdown}
            className="arrowdown"  
            style={{
            height:'70px', 
            width:'70px',
            position:'absolute',
            top: '71%',
            left: '53%'
          }} 
            alt="img"
        />
        </div>

      </section>
    </>


  );
};

export default Hero;
