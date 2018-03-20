package com.ems.iot.manage.dao;

import java.util.List;

import com.ems.iot.manage.entity.ProvinceInfo;

/**
 * province list
 * @author jiangkaiqiang
 * @version 创建时间：2016-11-7 下午2:04:16 
 *
 */
public interface ProvinceMapper {

    List<ProvinceInfo> findProvinceList();

}
