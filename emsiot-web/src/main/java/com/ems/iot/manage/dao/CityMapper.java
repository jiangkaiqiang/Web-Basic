package com.ems.iot.manage.dao;

import org.apache.ibatis.annotations.Param;

import com.ems.iot.manage.entity.CityInfo;
import com.ems.iot.manage.entity.ProvinceInfo;

import java.util.List;

/**
 * 
 * @author jiangkaiqiang
 * @version 创建时间：2016-11-7 下午1:56:40 
 *
 */
public interface CityMapper {
    List<CityInfo> findCitysByProvinceId(@Param("provinceID") int provinceID);
    
    List<CityInfo> findCityList();
    
    CityInfo findCityById(@Param("CityID") int CityID);

	ProvinceInfo findProvinceById(@Param("provinceID") int provinceID);

	List<ProvinceInfo> findProvinceByName(@Param("provinceName") String provinceName);

	List<CityInfo> findCityByNameAndProvinceId(@Param("cityName") String cityName, @Param("provinceID") Integer provinceID);

}
