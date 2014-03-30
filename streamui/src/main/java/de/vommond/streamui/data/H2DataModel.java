package de.vommond.streamui.data;

public interface H2DataModel {
		
	
	public static final String TABLE_BOOLEAN = "BOOLEAN_EVENT";
	
	public static final String CREATE_BOOLEAN = "CREATE TABLE BOOLEAN_EVENT("
												+ "id INTEGER AUTO_INCREMENT, "
												+ "timestamp BIGINT, "
												+ "server VARCHAR(255) NOT NULL, "
												+ "component VARCHAR(255) NOT NULL, "
												+ "instance VARCHAR(255) NOT NULL, "
												+ "aspect VARCHAR(255) NOT NULL, "
												+ "trues BIGINT NOT NULL, "
												+ "falses BIGINT NOT NULL, "
												+ "PRIMARY KEY (id) "
												+ ")";
	
	public static final String INSERT_BOOLEAN = "INSERT INTO BOOLEAN_EVENT "
												+ "(timestamp, server, component, instance, aspect, trues, falses) VALUES"
												+ "(?,?,?, ?, ?, ?,?)";
	
	public static final String DELETE_BOOLEAN = "DELETE FROM BOOLEAN_EVENT WHERE timestamp < ? ";
		
	
	
	

	public static final String TABLE_COUNT = "COUNT_EVENT";
	
	public static final String CREATE_COUNT = "CREATE TABLE COUNT_EVENT("
												+ "id INTEGER AUTO_INCREMENT, "
												+ "timestamp BIGINT, "
												+ "server VARCHAR(255) NOT NULL, "
												+ "component VARCHAR(255) NOT NULL, "
												+ "instance VARCHAR(255) NOT NULL, "
												+ "aspect VARCHAR(255) NOT NULL, "
												+ "count BIGINT NOT NULL, "
												+ "PRIMARY KEY (id) "
												+ ")";
	
	public static final String INSERT_COUNT = "INSERT INTO COUNT_EVENT "
												+ "(timestamp, server, component, instance, aspect, count) VALUES"
												+ "(?,?,?, ?, ?, ?)";

	public static final String DELETE_COUNT = "DELETE FROM COUNT_EVENT WHERE timestamp < ? ";
	
	
	
	
	public static final String TABLE_EMIT = "EMIT_EVENT";
	
	
	public static final String CREATE_EMIT = "CREATE TABLE EMIT_EVENT("
												+ "id INTEGER AUTO_INCREMENT, "
												+ "timestamp BIGINT, "
												+ "server VARCHAR(255) NOT NULL, "
												+ "component VARCHAR(255) NOT NULL, "
												+ "instance VARCHAR(255) NOT NULL, "
												+ "aspect VARCHAR(255) NOT NULL, "
												+ "count BIGINT NOT NULL, "
												+ "PRIMARY KEY (id) "
												+ ")";
	
	public static final String INSERT_EMIT = "INSERT INTO EMIT_EVENT "
												+ "(timestamp, server, component, instance, aspect, count) VALUES"
												+ "(?,?,?, ?, ?, ?)";
	
	public static final String DELETE_EMIT = "DELETE FROM EMIT_EVENT WHERE timestamp < ? ";
	
	
	
	
	public static final String TABLE_RECEIVE = "RECEIVE_EVENT";
	
	public static final String CREATE_RECEIVE = "CREATE TABLE RECEIVE_EVENT("
												+ "id INTEGER AUTO_INCREMENT, "
												+ "timestamp BIGINT, "
												+ "server VARCHAR(255) NOT NULL, "
												+ "component VARCHAR(255) NOT NULL, "
												+ "instance VARCHAR(255) NOT NULL, "
												+ "aspect VARCHAR(255) NOT NULL, "
												+ "count BIGINT NOT NULL, "
												+ "PRIMARY KEY (id) "
												+ ")";
	
	public static final String INSERT_RECEIVE= "INSERT INTO RECEIVE_EVENT "
												+ "(timestamp, server, component, instance, aspect, count) VALUES"
												+ "(?,?,?, ?, ?, ?)";
	
	public static final String DELETE_RECEIVE = "DELETE FROM RECEIVE_EVENT WHERE timestamp < ? ";
	
	
	
	
	
	
	public static final String TABLE_NUMBER = "NUMBER_EVENT";
	
	public static final String CREATE_NUMBER = "CREATE TABLE NUMBER_EVENT("
												+ "id INTEGER AUTO_INCREMENT, "
												+ "timestamp BIGINT, "
												+ "server VARCHAR(255) NOT NULL, "
												+ "component VARCHAR(255) NOT NULL, "
												+ "instance VARCHAR(255) NOT NULL, "
												+ "aspect VARCHAR(255) NOT NULL, "
												+ "count BIGINT NOT NULL, "
												+ "value FLOAT NOT NULL, "
												+ "PRIMARY KEY (id) "
												+ ")";
	
	public static final String INSERT_NUMBER= "INSERT INTO NUMBER_EVENT "
												+ "(timestamp, server, component, instance, aspect, count, value) VALUES"
												+ "(?,?,?, ?, ?, ?, ?)";
	
	public static final String DELETE_NUMBER = "DELETE FROM NUMBER_EVENT WHERE timestamp < ? ";
	
	
	

	public static final String TABLE_TIME = "TIME_EVENT";
	
	public static final String CREATE_TIME = "CREATE TABLE TIME_EVENT("
												+ "id INTEGER AUTO_INCREMENT, "
												+ "timestamp BIGINT, "
												+ "server VARCHAR(255) NOT NULL, "
												+ "component VARCHAR(255) NOT NULL, "
												+ "instance VARCHAR(255) NOT NULL, "
												+ "aspect VARCHAR(255) NOT NULL, "
												+ "count BIGINT NOT NULL, "
												+ "nanos BIGINT NOT NULL, "
												+ "PRIMARY KEY (id) "
												+ ")";

	public static final String INSERT_TIME= "INSERT INTO TIME_EVENT "
												+ "(timestamp, server, component, instance, aspect, count, nanos) VALUES"
												+ "(?,?,?, ?, ?, ?, ?)";
	
	public static final String DELETE_TIME = "DELETE FROM TIME_EVENT WHERE timestamp < ? ";
	
	
	
	
	public static final String TABLE_DIST = "DIST_EVENT";
	
	public static final String CREATE_DIST = "CREATE TABLE DIST_EVENT("
												+ "id INTEGER AUTO_INCREMENT, "
												+ "timestamp BIGINT, "
												+ "server VARCHAR(255) NOT NULL, "
												+ "component VARCHAR(255) NOT NULL, "
												+ "instance VARCHAR(255) NOT NULL, "
												+ "aspect VARCHAR(255) NOT NULL, "
												+ "value FLOAT NOT NULL, "
												+ "count INTEGER NOT NULL, "
												+ "PRIMARY KEY (id) "
												+ ")";
	
	public static final String INSERT_DIST= "INSERT INTO DIST_EVENT "
												+ "(timestamp, server, component, instance, aspect, value, count) VALUES"
												+ "(?,?,?, ?, ?, ?, ?)";
	
	public static final String DELETE_DIST = "DELETE FROM DIST_EVENT WHERE timestamp < ? ";
}
