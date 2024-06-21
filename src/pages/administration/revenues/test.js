<div className="">
    <div className="mb-3">
        <label className="form-label" htmlFor="exampleInputEmail1">
            Revenue
        </label>
        <select
            className="form-select"
            name="agencies id"
            onChange={(e) => {
            setAgencyName(e.target.value);
            getAgencyId(e.target.value);
            }} 
            value={agencyName}
        >
            <option value="">Select Revenue</option>
            {agencies.map((agency) => (
            <option key={agency.agencyId} value={agency.agencyName} className="text-dark">
                {agency.agencyName}
            </option>
            ))}
        </select>
    </div>
</div>