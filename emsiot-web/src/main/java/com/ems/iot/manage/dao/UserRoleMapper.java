package com.ems.iot.manage.dao;

import java.util.List;

import org.apache.ibatis.annotations.Param;
import com.ems.iot.manage.entity.UserRole;
import com.github.pagehelper.Page;

/**
 * @author Barry
 * @date 2018年3月20日下午3:36:25  
 * @version 1.0
 * Copyright: Copyright (c) EMSIOT 2018
 */
public interface UserRoleMapper {
    int deleteByPrimaryKey(Integer user_role_id);

    int insert(UserRole record);

    int insertSelective(UserRole record);

    UserRole selectByPrimaryKey(Integer user_role_id);

    int updateByPrimaryKeySelective(UserRole record);

    int updateByPrimaryKey(UserRole record);
    
    Page<UserRole> findAllUserRole(@Param("startTime")String startTime, @Param("endTime")String endTime, @Param("keyword")String keyword);
    
    List<UserRole> findAllUserRoleList();
}
