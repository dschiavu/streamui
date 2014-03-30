package de.vommond.streamui.data;

import java.io.File;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;

import de.vommond.streamui.client.BooleanEvent;
import de.vommond.streamui.client.CountEvent;
import de.vommond.streamui.client.DistributionEvent;
import de.vommond.streamui.client.EmitEvent;
import de.vommond.streamui.client.Events;
import de.vommond.streamui.client.NumberEvent;
import de.vommond.streamui.client.ReceiveEvent;
import de.vommond.streamui.client.TimeEvent;
import de.vommond.streamui.status.TopologyStatus;
import de.vommond.util.Logger;

public class H2DataService implements IDataService{
	
	private PreparedStatement insertBooleanEvent;
	
	private PreparedStatement insertCountEvent;
	
	private PreparedStatement insertEmitEvent;
	
	private PreparedStatement insertReceiveEvent;
	
	private PreparedStatement insertNumberEvent;
	
	private PreparedStatement insertDistributionEvent;
	
	private PreparedStatement insertTimeEvent;
	
	
	private PreparedStatement deleteBooleanEvent;
	
	private PreparedStatement deleteCountEvent;
	
	private PreparedStatement deleteEmitEvent;
	
	private PreparedStatement deleteReceiveEvent;
	
	private PreparedStatement deleteNumberEvent;
	
	private PreparedStatement deleteDistributionEvent;
	
	private PreparedStatement deleteTimeEvent;
	
	
	
	private Connection conn;
	
	private final String location;
	
	public H2DataService(String location){
		this.location = location;
	}

	public void close() {
	
		if(this.conn!=null){
			try {
				this.conn.close();
			} catch (SQLException e) {
				Logger.error(this.getClass(), "close", e.getLocalizedMessage());
			}
		}
		
	}
	
	
	public Map<String, Long> getEventStatistics(String topology) {
		 Map<String, Long>  result = new HashMap<String, Long>();
		 
		Connection c = getConnection(topology);
		try{
			
			
			/**
			 * Boolean
			 */
			PreparedStatement statment = c.prepareStatement(H2Queries.COUNT.replace(H2Queries.TABLE, H2DataModel.TABLE_BOOLEAN));
		 	ResultSet set = statment.executeQuery();
		 	while(set.next()){
		 		long count = set.getLong(1);
		 		result.put("boolean", count);
		 	}
		 	
		 	
		 	/**
		 	 * Count
		 	 */
		 	statment = c.prepareStatement(H2Queries.COUNT.replace(H2Queries.TABLE, H2DataModel.TABLE_COUNT));
		 	set = statment.executeQuery();
		 	while(set.next()){
		 		long count = set.getLong(1);
		 		result.put("count", count);
		 	}
		 	
		 	
			/**
		 	 * Emit
		 	 */
			statment = c.prepareStatement(H2Queries.COUNT.replace(H2Queries.TABLE, H2DataModel.TABLE_EMIT));
		 	set = statment.executeQuery();
		 	while(set.next()){
		 		long count = set.getLong(1);
		 		result.put("emit", count);
		 	}
		 	
		 	
			/**
		 	 * Receive
		 	 */
			statment = c.prepareStatement(H2Queries.COUNT.replace(H2Queries.TABLE, H2DataModel.TABLE_RECEIVE));
		 	set = statment.executeQuery();
		 	while(set.next()){
		 		long count = set.getLong(1);
		 		result.put("receive", count);
		 	}
		 	
		 	
		 	/**
		 	 * Number
		 	 */
			statment = c.prepareStatement(H2Queries.COUNT.replace(H2Queries.TABLE, H2DataModel.TABLE_NUMBER));
		 	set = statment.executeQuery();
		 	while(set.next()){
		 		long count = set.getLong(1);
		 		result.put("number", count);
		 	}
		 	
		 	
		 	/**
		 	 * Time
		 	 */
		 	statment = c.prepareStatement(H2Queries.COUNT.replace(H2Queries.TABLE, H2DataModel.TABLE_TIME));
		 	set = statment.executeQuery();
		 	while(set.next()){
		 		long count = set.getLong(1);
		 		result.put("time", count);
		 	}
		 	
		 	
		 	/**
		 	 * Number
		 	 */
		 	statment = c.prepareStatement(H2Queries.COUNT.replace(H2Queries.TABLE, H2DataModel.TABLE_DIST));
		 	set = statment.executeQuery();
		 	while(set.next()){
		 		long count = set.getLong(1);
		 		result.put("dist", count);
		 	}
		 	
			
		} catch (Exception e) {
			Logger.error(this.getClass(), "getEventStatistics", e.getLocalizedMessage());
		}
		
		return result;
	}
	
	public TopologyStatus getInstanceStatus(String topology, long from,long to){
		TopologyStatus status = new TopologyStatus(topology);
		status.setFrom(from);
		status.setTo(to);
		
		Connection c = getConnection(topology);
		try{
			
			
			/**
			 * Boolean
			 */
			PreparedStatement statment = c.prepareStatement(H2Queries.AGGREGATE_BOOLEAN.replace(H2Queries.FIELD, H2Queries.INSTANCE));
		 	statment.setLong(1, from);
			statment.setLong(2, to);
		 	ResultSet set = statment.executeQuery();
		 	while(set.next()){
		 		String id = set.getString(1);
		 		String aspect = set.getString(2);
		 		double trues = set.getDouble(3);
		 		double falses = set.getDouble(4);
		 		status.getInstance(id).addTruesPercentage(aspect, trues / (falses + trues));
		 	}
		 	
		 	
		 	/**
		 	 * Count
		 	 */
			statment = c.prepareStatement(H2Queries.AGGREGATE_COUNT.replace(H2Queries.FIELD, H2Queries.INSTANCE));
		 	statment.setLong(1, from);
			statment.setLong(2, to);
		 	set = statment.executeQuery();
		 	while(set.next()){
		 		String id = set.getString(1);
		 		String aspect = set.getString(2);
		 		long count = set.getLong(3);
		 		status.getInstance(id).addCount(aspect, count);
		 	}
		 	
		 	
			/**
		 	 * Emit
		 	 */
			statment = c.prepareStatement(H2Queries.AGGREGATE_EMIT.replace(H2Queries.FIELD, H2Queries.INSTANCE));
		 	statment.setLong(1, from);
			statment.setLong(2, to);
		 	set = statment.executeQuery();
		 	while(set.next()){
		 		String id = set.getString(1);
		 		String aspect = set.getString(2);
		 		long count = set.getLong(3);
		 		status.getInstance(id).addEmit(aspect, count);
		 	}
		 	
		 	
			/**
		 	 * Receive
		 	 */
			statment = c.prepareStatement(H2Queries.AGGREGATE_RECEIVE.replace(H2Queries.FIELD, H2Queries.INSTANCE));
		 	statment.setLong(1, from);
			statment.setLong(2, to);
		 	set = statment.executeQuery();
		 	while(set.next()){
		 		String id = set.getString(1);
		 		String aspect = set.getString(2);
		 		long count = set.getLong(3);
		 		status.getInstance(id).addReceive(aspect, count);
		 	}
		 	
		 	
		 	/**
		 	 * Number
		 	 */
			statment = c.prepareStatement(H2Queries.AGGREGATE_NUMBER.replace(H2Queries.FIELD, H2Queries.INSTANCE));
		 	statment.setLong(1, from);
			statment.setLong(2, to);
		 	set = statment.executeQuery();
		 	while(set.next()){
		 		String id = set.getString(1);
		 		String aspect = set.getString(2);
		 		long count = set.getLong(3);
		 		double value = set.getDouble(4);
		 		double mean = (double)value/(double)count;
		 		status.getInstance(id).addNumberMean(aspect,mean);
		 	}
		 	
		 	
		 	/**
		 	 * Number
		 	 */
			statment = c.prepareStatement(H2Queries.AGGREGATE_TIME.replace(H2Queries.FIELD, H2Queries.INSTANCE));
		 	statment.setLong(1, from);
			statment.setLong(2, to);
		 	set = statment.executeQuery();
		 	while(set.next()){
		 		String id = set.getString(1);
		 		String aspect = set.getString(2);
		 		long count = set.getLong(3);
		 		long nanos = set.getLong(4);
		 		long mean = nanos / count;
		 		status.getInstance(id).addTimeMean(aspect,mean);
		 	}
		 	
		 	
		 	/**
		 	 * Number
		 	 */
			statment = c.prepareStatement(H2Queries.AGGREGATE_DIST.replace(H2Queries.FIELD, H2Queries.INSTANCE));
		 	statment.setLong(1, from);
			statment.setLong(2, to);
		 	set = statment.executeQuery();
		 	while(set.next()){
		 		String id = set.getString(1);
		 		String aspect = set.getString(2);
		 		double value = set.getDouble(3);
		 		long count = set.getLong(4);
		 		status.getInstance(id).addDistrubtion(aspect, value, count);
		 	}
		 	
			
		} catch (Exception e) {
			Logger.error(this.getClass(), "getInstanceStatus", e.getLocalizedMessage());
		}
		
		return status;
	}
	
	public TopologyStatus getComponentStatus(String topology, long from,long to){
		
		TopologyStatus status = new TopologyStatus(topology);
		status.setFrom(from);
		status.setTo(to);
		
		
		Connection c = getConnection(topology);
		try{
			
			/**
			 * Boolean
			 */
			PreparedStatement statment = c.prepareStatement(H2Queries.AGGREGATE_BOOLEAN.replace(H2Queries.FIELD, H2Queries.COMPONENT));
		 	statment.setLong(1, from);
			statment.setLong(2, to);
		 	ResultSet set = statment.executeQuery();
		 	while(set.next()){
		 		String id = set.getString(1);
		 		String aspect = set.getString(2);
		 		double trues = set.getDouble(3);
		 		double falses = set.getDouble(4);
		 		status.getComponent(id).addTruesPercentage(aspect, trues / (falses + trues));
		 	}
		 	
		 	
		 	/**
		 	 * Count
		 	 */
			statment = c.prepareStatement(H2Queries.AGGREGATE_COUNT.replace(H2Queries.FIELD, H2Queries.COMPONENT));
		 	statment.setLong(1, from);
			statment.setLong(2, to);
		 	set = statment.executeQuery();
		 	while(set.next()){
		 		String id = set.getString(1);
		 		String aspect = set.getString(2);
		 		long count = set.getLong(3);
		 		status.getComponent(id).addCount(aspect, count);
		 	}
		 	
		 	
			/**
		 	 * Emit
		 	 */
			statment = c.prepareStatement(H2Queries.AGGREGATE_EMIT.replace(H2Queries.FIELD, H2Queries.COMPONENT));
		 	statment.setLong(1, from);
			statment.setLong(2, to);
		 	set = statment.executeQuery();
		 	while(set.next()){
		 		String id = set.getString(1);
		 		String aspect = set.getString(2);
		 		long count = set.getLong(3);
		 		status.getComponent(id).addEmit(aspect, count);
		 	}
		 	
		 	
			/**
		 	 * Receive
		 	 */
			statment = c.prepareStatement(H2Queries.AGGREGATE_RECEIVE.replace(H2Queries.FIELD, H2Queries.COMPONENT));
		 	statment.setLong(1, from);
			statment.setLong(2, to);
		 	set = statment.executeQuery();
		 	while(set.next()){
		 		String id = set.getString(1);
		 		String aspect = set.getString(2);
		 		long count = set.getLong(3);
		 		status.getComponent(id).addReceive(aspect, count);
		 	}
		 	
		 	
		 	/**
		 	 * Number
		 	 */
			statment = c.prepareStatement(H2Queries.AGGREGATE_NUMBER.replace(H2Queries.FIELD, H2Queries.COMPONENT));
		 	statment.setLong(1, from);
			statment.setLong(2, to);
		 	set = statment.executeQuery();
		 	while(set.next()){
		 		String id = set.getString(1);
		 		String aspect = set.getString(2);
		 		long count = set.getLong(3);
		 		double value = set.getDouble(4);
		 		double mean = (double)value/(double)count;
		 		status.getComponent(id).addNumberMean(aspect,mean);
		 	}
		 	
		 	
		 	/**
		 	 * Number
		 	 */
			statment = c.prepareStatement(H2Queries.AGGREGATE_TIME.replace(H2Queries.FIELD, H2Queries.COMPONENT));
		 	statment.setLong(1, from);
			statment.setLong(2, to);
		 	set = statment.executeQuery();
		 	while(set.next()){
		 		String id = set.getString(1);
		 		String aspect = set.getString(2);
		 		long count = set.getLong(3);
		 		long nanos = set.getLong(4);
		 		long mean = nanos / count;
		 		status.getComponent(id).addTimeMean(aspect,mean);
		 	}
		 	
		 	
		 	/**
		 	 * Number
		 	 */
			statment = c.prepareStatement(H2Queries.AGGREGATE_DIST.replace(H2Queries.FIELD, H2Queries.COMPONENT));
		 	statment.setLong(1, from);
			statment.setLong(2, to);
		 	set = statment.executeQuery();
		 	while(set.next()){
		 		String id = set.getString(1);
		 		String aspect = set.getString(2);
		 		double value = set.getDouble(3);
		 		long count = set.getLong(4);
		 		status.getComponent(id).addDistrubtion(aspect, value, count);
		 	}
			
		} catch (Exception e) {
			Logger.error(this.getClass(), "getComponentStatus", e.getLocalizedMessage());
		}
		
		return status;
	}
	
	
	
	public Collection<String> getServer(String topology, int millis){
		
		HashSet<String> servers = new HashSet<String>();
		
		Connection c = getConnection(topology);
		try{
			
			PreparedStatement statment = c.prepareStatement(H2Queries.GET_SERVERS);
		 	statment.setLong(1, millis);
			statment.setLong(2, millis);
			statment.setLong(3, millis);
			statment.setLong(4, millis);
			statment.setLong(5, millis);
			statment.setLong(6, millis);
			statment.setLong(7, millis);
		
		 	ResultSet set = statment.executeQuery();
		 	while(set.next()){
		 		servers.add(set.getString(1));
		 	}
		 	
			
		} catch (Exception e) {
			Logger.error(this.getClass(), "clear", e.getLocalizedMessage());
		}
		
		return servers;
	}
	
	public Collection<String> getComponents(String topology, int millis){
		
		HashSet<String> servers = new HashSet<String>();
		
		Connection c = getConnection(topology);
		try{
			
			PreparedStatement statment = c.prepareStatement(H2Queries.GET_COMPONENTS);
		 	statment.setLong(1, millis);
			statment.setLong(2, millis);
			statment.setLong(3, millis);
			statment.setLong(4, millis);
			statment.setLong(5, millis);
			statment.setLong(6, millis);
			statment.setLong(7, millis);
		
		 	ResultSet set = statment.executeQuery();
		 	while(set.next()){
		 		servers.add(set.getString(1));
		 	}
		 	
			
		} catch (Exception e) {
			Logger.error(this.getClass(), "clear", e.getLocalizedMessage());
		}
		
		return servers;
	}
	
	
	public Collection<String> getInstances(String topology, int millis){
		
		HashSet<String> servers = new HashSet<String>();
		
		Connection c = getConnection(topology);
		try{
			
			PreparedStatement statment = c.prepareStatement(H2Queries.GET_INSTANCES);
		 	statment.setLong(1, millis);
			statment.setLong(2, millis);
			statment.setLong(3, millis);
			statment.setLong(4, millis);
			statment.setLong(5, millis);
			statment.setLong(6, millis);
			statment.setLong(7, millis);
		
		 	ResultSet set = statment.executeQuery();
		 	while(set.next()){
		 		servers.add(set.getString(1));
		 	}
		 	
			
		} catch (Exception e) {
			Logger.error(this.getClass(), "clear", e.getLocalizedMessage());
		}
		
		return servers;
	}


	public int clear(String topology, long currentTimeMillis){
		Connection c = getConnection(topology);
		
		int deletes = 0;
		try{
			deleteBooleanEvent.setLong(1, currentTimeMillis);
			deleteCountEvent.setLong(1, currentTimeMillis);
			deleteDistributionEvent.setLong(1, currentTimeMillis);
			deleteEmitEvent.setLong(1, currentTimeMillis);
			deleteNumberEvent.setLong(1, currentTimeMillis);
			deleteReceiveEvent.setLong(1, currentTimeMillis);
			deleteTimeEvent.setLong(1, currentTimeMillis);
			
			 deletes = deleteBooleanEvent.executeUpdate();
			
			deletes+= deleteCountEvent.executeUpdate();
		
			
			deletes+=deleteDistributionEvent.executeUpdate();
			
			
			deletes+=deleteEmitEvent.executeUpdate();
			
			
			deletes+=deleteNumberEvent.executeUpdate();
			
			
			deletes+=deleteReceiveEvent.executeUpdate();
			
			
			deletes+=deleteTimeEvent.executeUpdate();
			
			c.commit();
			
			
			Logger.info(this.getClass(), "clear","Deleted "+ deletes + " events");
			
		} catch (Exception e) {
			Logger.error(this.getClass(), "clear", e.getLocalizedMessage());
		}
		
		return deletes;
	}

	public int save(Events e) {
		Connection c = getConnection(e.getTopology());
		int inserts = 0;
		
		try{
			
			ArrayList<BooleanEvent> booleanEvents = e.getBools();
			for(BooleanEvent event : booleanEvents){
				
				insertBooleanEvent.setLong(1, e.getTimestamp());
				insertBooleanEvent.setString(2, event.getServer());
				insertBooleanEvent.setString(3, event.getComponent());
				insertBooleanEvent.setString(4, event.getInstance());
				insertBooleanEvent.setString(5, event.getAspect());
				
				insertBooleanEvent.setLong(6, event.getTrues());
				insertBooleanEvent.setLong(7, event.getFalses());
				int done = insertBooleanEvent.executeUpdate();
				
				if(done==0){
					Logger.error(this.getClass(), "clear", "Did not insert BooleanEvent");
				}
				inserts+=done;
			}
			
			
			ArrayList<CountEvent> countEvents = e.getCounts();
			for(CountEvent event : countEvents){
				
				insertCountEvent.setLong(1, e.getTimestamp());
				insertCountEvent.setString(2, event.getServer());
				insertCountEvent.setString(3, event.getComponent());
				insertCountEvent.setString(4, event.getInstance());
				insertCountEvent.setString(5, event.getAspect());
				
				insertCountEvent.setLong(6, event.getCount());
				int done = insertCountEvent.executeUpdate();
				
				if(done==0){
					Logger.error(this.getClass(), "clear", "Did not insert CountEvent");
				}
				inserts+=done;
			}
			
			
			ArrayList<EmitEvent> emitEvents = e.getEmits();
			for(EmitEvent event : emitEvents){
				
				insertEmitEvent.setLong(1, e.getTimestamp());
				insertEmitEvent.setString(2, event.getServer());
				insertEmitEvent.setString(3, event.getComponent());
				insertEmitEvent.setString(4, event.getInstance());
				insertEmitEvent.setString(5, event.getAspect());
				
				insertEmitEvent.setLong(6, event.getCount());
				int done = insertEmitEvent.executeUpdate();
				
				if(done==0){
					Logger.error(this.getClass(), "clear", "Did not insert EmitEvent");
				}
				inserts+=done;
			}
			
			
			ArrayList<ReceiveEvent> receiveEvents = e.getReceives();
			for(ReceiveEvent event : receiveEvents){
				
				insertReceiveEvent.setLong(1, e.getTimestamp());
				insertReceiveEvent.setString(2, event.getServer());
				insertReceiveEvent.setString(3, event.getComponent());
				insertReceiveEvent.setString(4, event.getInstance());
				insertReceiveEvent.setString(5, event.getAspect());
				
				insertReceiveEvent.setLong(6, event.getCount());
				int done = insertReceiveEvent.executeUpdate();
				
				if(done==0){
					Logger.error(this.getClass(), "clear", "Did not insert ReceiveEvent");
				}
				inserts+=done;
			}
			
			
			ArrayList<NumberEvent> numberEvents = e.getNumbers();
			for(NumberEvent event : numberEvents){
				
				insertNumberEvent.setLong(1, e.getTimestamp());
				insertNumberEvent.setString(2, event.getServer());
				insertNumberEvent.setString(3, event.getComponent());
				insertNumberEvent.setString(4, event.getInstance());
				insertNumberEvent.setString(5, event.getAspect());
				
				insertNumberEvent.setLong(6, event.getCount());
				insertNumberEvent.setDouble(7, event.getValue());
				int done = insertNumberEvent.executeUpdate();
				
				if(done==0){
					Logger.error(this.getClass(), "clear", "Did not insert NumberEvent");
				}
				inserts+=done;
			}
			
			
			ArrayList<TimeEvent> timEvents = e.getTime();
			for(TimeEvent event : timEvents){
				
				insertTimeEvent.setLong(1, e.getTimestamp());
				insertTimeEvent.setString(2, event.getServer());
				insertTimeEvent.setString(3, event.getComponent());
				insertTimeEvent.setString(4, event.getInstance());
				insertTimeEvent.setString(5, event.getAspect());
				
				insertTimeEvent.setLong(6, event.getCount());
				insertTimeEvent.setLong(7, event.getNanos());
				int done = insertTimeEvent.executeUpdate();
				
				if(done==0){
					Logger.error(this.getClass(), "clear", "Did not insert NumberEvent");
				}
				inserts+=done;
			}
			
			ArrayList<DistributionEvent> distEvents = e.getDistributions();
			for(DistributionEvent event : distEvents){
				
				HashMap<Double, Long> dist = event.getDistribution();
				for(Double value : dist.keySet()){
					
					insertDistributionEvent.setLong(1, e.getTimestamp());
					insertDistributionEvent.setString(2, event.getServer());
					insertDistributionEvent.setString(3, event.getComponent());
					insertDistributionEvent.setString(4, event.getInstance());
					insertDistributionEvent.setString(5, event.getAspect());
					
					insertDistributionEvent.setDouble(6, value);
					insertDistributionEvent.setLong(7, dist.get(value));
				
					int done = insertDistributionEvent.executeUpdate();
					
					if(done==0){
						Logger.error(this.getClass(), "clear", "Did not insert NumberEvent");
					}
					inserts+=done;
				}
				
				
			}
			

			c.commit();
			
			Logger.info(this.getClass(), "save", "Added " + inserts + " events");
		} catch(Exception ex){
			Logger.error(this.getClass(), "save", ex.getLocalizedMessage());
		}
		
		
		

		return inserts;
		
	}

	private Connection getConnection(String topology) {
		Logger.debug(this.getClass(), "getConnection", "enter");
		
		if(conn == null){
			 try {
				 
				File folder = new File(this.location + "/"+topology);
				boolean exists = folder.exists();
				Class.forName("org.h2.Driver");
				String url = "jdbc:h2:"+this.location + "/"+topology+"/db";
				conn = DriverManager.getConnection(url, "sa", "");
		
				
				if(!exists){
				
					Statement statement = conn.createStatement();
					statement.execute(H2DataModel.CREATE_BOOLEAN);
					
					statement = conn.createStatement();
					statement.execute(H2DataModel.CREATE_COUNT);
				
					statement = conn.createStatement();
					statement.execute(H2DataModel.CREATE_DIST);
					
					statement = conn.createStatement();
					statement.execute(H2DataModel.CREATE_EMIT);
					
					statement = conn.createStatement();
					statement.execute(H2DataModel.CREATE_NUMBER);
					
					statement = conn.createStatement();
					statement.execute(H2DataModel.CREATE_RECEIVE);
					
					statement = conn.createStatement();
					statement.execute(H2DataModel.CREATE_TIME);
					
					Logger.info(this.getClass(), "init", "Created Data Bases");
				}
				
			
				/**
				 * Prepared statements
				 */
				this.insertBooleanEvent = conn.prepareStatement(H2DataModel.INSERT_BOOLEAN);
				
				this.insertCountEvent = conn.prepareStatement(H2DataModel.INSERT_COUNT);
				
				this.insertEmitEvent = conn.prepareStatement(H2DataModel.INSERT_EMIT);
				
				this.insertReceiveEvent = conn.prepareStatement(H2DataModel.INSERT_RECEIVE);
				
				this.insertNumberEvent = conn.prepareStatement(H2DataModel.INSERT_NUMBER);
				
				this.insertTimeEvent = conn.prepareStatement(H2DataModel.INSERT_TIME);
				
				this.insertDistributionEvent = conn.prepareStatement(H2DataModel.INSERT_DIST);
				
				
				this.deleteBooleanEvent = conn.prepareStatement(H2DataModel.DELETE_BOOLEAN);
				
				this.deleteCountEvent = conn.prepareStatement(H2DataModel.DELETE_COUNT);
				
				this.deleteReceiveEvent = conn.prepareStatement(H2DataModel.DELETE_RECEIVE);
				
				this.deleteEmitEvent = conn.prepareStatement(H2DataModel.DELETE_EMIT);
				
				this.deleteNumberEvent = conn.prepareStatement(H2DataModel.DELETE_NUMBER);
				
				this.deleteTimeEvent = conn.prepareStatement(H2DataModel.DELETE_TIME);
				
				this.deleteDistributionEvent = conn.prepareStatement(H2DataModel.DELETE_DIST);
				
				Logger.debug(this.getClass(), "getConnection", "Connected to " + url);
			} catch (Exception e) {
				Logger.error(this.getClass(), "getConnection", e.getLocalizedMessage());
			}
		 
		}
	  
		return conn;
	}

	

	
	
	
}
