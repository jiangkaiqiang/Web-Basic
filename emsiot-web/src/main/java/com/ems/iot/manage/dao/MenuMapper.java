package com.ems.iot.manage.dao;

import com.ems.iot.manage.entity.Menu;

/**
 * @author Barry
 * @date 2018年3月20日下午3:34:29  
 * @version 1.0
 * Copyright: Copyright (c) EMSIOT 2018
 */
public interface MenuMapper {
    int deleteByPrimaryKey(Integer menu_id);

    int insert(Menu record);

    int insertSelective(Menu record);

    Menu selectByPrimaryKey(Integer menu_id);

    int updateByPrimaryKeySelective(Menu record);

    int updateByPrimaryKey(Menu record);
}