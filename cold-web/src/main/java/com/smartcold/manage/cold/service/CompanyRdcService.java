package com.smartcold.manage.cold.service;

import java.util.List;

import com.smartcold.manage.cold.entity.olddb.CompanyRdc;

public interface CompanyRdcService {

    public CompanyRdc getCompRdcByCompRdcId(int companyRdcId);
	
	public List<CompanyRdc> getCompRdcsByCompId(int companyId);
	
}