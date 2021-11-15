import React, {useState} from 'react';
import axios from 'axios';
import './CheckDomain.css'





function CheckDomain() {

  
    const [domainName, setDomainName] = useState("");
    const [avail, setAvail] = useState()
    const [validity, setValidity] = useState(true)


  
        const fetchDomainData = async(e)=>{

            e.preventDefault();

            const url = 'http://127.0.0.1:5000/overit-domenu'
            const data = {
                domain_name: domainName
            }

            
            const resp = await axios.post(url, data);
     
            setAvail(resp.data.availability)
            if(resp.data.status === 'invalid'){
                setValidity(!validity)
            }else{
                setValidity(true)
            }
        }


  return (
    <div className="form-wrapper">
         <h1>Check Domain Name</h1>
        <form onSubmit={fetchDomainData}>
           
            <input type="text" className="txt-input" value={domainName} onChange={(e)=> setDomainName(e.target.value) } />
            <input type="submit" className="form-btn" value="Check Domain" />
        </form>
        {avail === 0 ? <h1>Not available</h1> : avail === 1 ? <h1>Available</h1> : <></> }
        {!validity ? <h1>Invalid Domain name</h1> : <></>}
    </div>
  );
}

export default CheckDomain;