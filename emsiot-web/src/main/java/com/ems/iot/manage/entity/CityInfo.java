package com.ems.iot.manage.entity;
/**
 * @author Barry
 * @date 2018年3月20日下午3:37:36  
 * @version 1.0
 * Copyright: Copyright (c) EMSIOT 2018
 */
public class CityInfo {
	private Integer ci_id;
	
	private Integer ci_province;
	
	private String ci_city;

	public Integer getCi_id() {
		return ci_id;
	}

	public void setCi_id(Integer ci_id) {
		this.ci_id = ci_id;
	}

	public Integer getCi_province() {
		return ci_province;
	}

	public void setCi_province(Integer ci_province) {
		this.ci_province = ci_province;
	}

	public String getCi_city() {
		return ci_city;
	}

	public void setCi_city(String ci_city) {
		this.ci_city = ci_city;
	}
	
	
}
