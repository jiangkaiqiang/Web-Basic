package com.smartcold.bgzigbee.manage.dao;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.github.pagehelper.Page;
import com.smartcold.bgzigbee.manage.entity.RdcEntity;

public interface RdcMapper {

	Page<RdcEntity> findRdcList(@Param("audit")Integer audit, @Param("keyword")String keyword);

	List<RdcEntity> findRDCByRDCId(@Param("rdcID") int rdcID);

	int insertRdc(RdcEntity rdc);

	void updateRdc(RdcEntity rdcEntity);

	int checkName(String name);

	boolean checkCellphone(String cellphone);

	void updateMappingById(@Param("rdcId") int rdcId, @Param("mapping") String mapping);
	
	int deleteByRdcID(int rdcID);
	
	int changeAudit(@Param("rdcID") int rdcID,@Param("audit") int audit);
}