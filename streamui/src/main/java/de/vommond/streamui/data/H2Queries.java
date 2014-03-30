package de.vommond.streamui.data;

public interface H2Queries {
	
//	public static final String[] TABLES = {"BOOLEAN_EVENT", "COUNT_EVENT", "EMIT_EVENT" , "TIME_EVENT", "RECEIVE_EVENT", "NUMBER_EVENT", "DIST_EVENT"};
//
//	public static final String BOOLEAN_EVENT = "BOOLEAN_EVENT";
//	
//	public static final String COUNT_EVENT = "COUNT_EVENT";
//	
//	public static final String EMIT_EVENT = "EMIT_EVENT";
//	
//	public static final String RECEIVE_EVENT = "RECEIVE_EVENT";
//	
//	public static final String NUMBER_EVENT = "NUMBER_EVENT";
//	
//	public static final String DIST_EVENT = "DIST_EVENT";
//	
//	public static final String TIME_EVENT = "TIME_EVENT";
	
	
	public static final String SERVER = "server";
	
	public static final String COMPONENT = "component";
	
	public static final String INSTANCE = "instance";
	
	public static final String ASPECT = "instance";
	
	public static final String FIELD = "$field";
	
	public static final String TABLE = "$table";
	
	
	public static final String COUNT = "SELECT count(*) FROM $table";
	
	
	
	
	public static final String AGGREGATE_BOOLEAN = "SELECT $field, aspect, sum(trues), sum(falses) FROM BOOLEAN_EVENT WHERE timestamp > ? AND timestamp < ? GROUP BY $field, aspect";
	
	
	public static final String AGGREGATE_NUMBER = "SELECT $field, aspect, sum(count), sum(value) FROM NUMBER_EVENT WHERE timestamp > ? AND timestamp < ? GROUP BY $field, aspect";
	
	
	public static final String AGGREGATE_COUNT= "SELECT $field, aspect, sum(count) FROM COUNT_EVENT WHERE timestamp > ? AND timestamp < ? GROUP BY $field, aspect";
	
	
	public static final String AGGREGATE_EMIT = "SELECT $field, aspect, sum(count) FROM EMIT_EVENT WHERE timestamp > ? AND timestamp < ? GROUP BY $field, aspect";

	
	public static final String AGGREGATE_RECEIVE = "SELECT $field, aspect, sum(count) FROM RECEIVE_EVENT WHERE timestamp > ? AND timestamp < ? GROUP BY $field, aspect";
	
	
	public static final String AGGREGATE_TIME = "SELECT $field, aspect, sum(count), sum(nanos) FROM TIME_EVENT WHERE timestamp > ? AND timestamp < ? GROUP BY $field, aspect";
	
	
	public static final String AGGREGATE_DIST = "SELECT $field, aspect, value, sum(count) FROM DIST_EVENT WHERE timestamp > ? AND timestamp < ? GROUP BY $field, aspect, value";
	
		
	
	
	public static final String GET_SERVERS = "( SELECT distinct(server) FROM BOOLEAN_EVENT WHERE timestamp > ? ) UNION "
										   + "( SELECT distinct(server) FROM COUNT_EVENT WHERE timestamp > ? ) UNION "
										   + "( SELECT distinct(server) FROM EMIT_EVENT WHERE timestamp > ? ) UNION "
										   + "( SELECT distinct(server) FROM RECEIVE_EVENT WHERE timestamp > ? ) UNION "
										   + "( SELECT distinct(server) FROM NUMBER_EVENT WHERE timestamp > ? ) UNION "
										   + "( SELECT distinct(server) FROM DIST_EVENT WHERE timestamp > ? ) UNION "
										   + "( SELECT distinct(server) FROM TIME_EVENT WHERE timestamp > ? ) ";

	
	public static final String GET_COMPONENTS = "( SELECT distinct(component) FROM BOOLEAN_EVENT WHERE timestamp > ? ) UNION "
										   + "( SELECT distinct(component) FROM COUNT_EVENT WHERE timestamp > ? ) UNION "
										   + "( SELECT distinct(component) FROM EMIT_EVENT WHERE timestamp > ? ) UNION "
										   + "( SELECT distinct(component) FROM RECEIVE_EVENT WHERE timestamp > ? ) UNION "
										   + "( SELECT distinct(component) FROM NUMBER_EVENT WHERE timestamp > ? ) UNION "
										   + "( SELECT distinct(component) FROM DIST_EVENT WHERE timestamp > ? ) UNION "
										   + "( SELECT distinct(component) FROM TIME_EVENT WHERE timestamp > ? ) ";


	public static final String GET_INSTANCES = "( SELECT distinct(instance) FROM BOOLEAN_EVENT WHERE timestamp > ? ) UNION "
										   + "( SELECT distinct(instance) FROM COUNT_EVENT WHERE timestamp > ? ) UNION "
										   + "( SELECT distinct(instance) FROM EMIT_EVENT WHERE timestamp > ? ) UNION "
										   + "( SELECT distinct(instance) FROM RECEIVE_EVENT WHERE timestamp > ? ) UNION "
										   + "( SELECT distinct(instance) FROM NUMBER_EVENT WHERE timestamp > ? ) UNION "
										   + "( SELECT distinct(instance) FROM DIST_EVENT WHERE timestamp > ? ) UNION "
										   + "( SELECT distinct(instance) FROM TIME_EVENT WHERE timestamp > ? ) ";

	
	

}
