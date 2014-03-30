package de.vommond.streamui;

import java.io.IOException;
import java.util.Collections;
import java.util.List;
import java.util.Map;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import de.vommond.streamui.client.Events;
import de.vommond.streamui.data.IDataService;
import de.vommond.streamui.data.H2DataService;
import de.vommond.streamui.status.TopologyStatus;
import de.vommond.util.KeyValueService;
import de.vommond.util.Logger;

public class StreamUI {
	
	private IDataService ds;
		
	public TopologyStatus getComponentStatus(String topology, long from, long to){
		Logger.info(this.getClass(), "saveEvents", "enter");
		try{
			IDataService ds = this.getDataService();
			
			return ds.getComponentStatus(topology, from, to);
		
		} catch (Exception ex) {
			Logger.error(this.getClass(), "getComponentStatus", "Error : " + ex.getLocalizedMessage());
		}
		
		return null;
	}
	
	
	
	public TopologyStatus getInstanceStatus(String topology, long from, long to){
		Logger.info(this.getClass(), "saveEvents", "enter");
		try{
			IDataService ds = this.getDataService();
			
			return ds.getInstanceStatus(topology, from, to);
		
		} catch (Exception ex) {
			Logger.error(this.getClass(), "getComponentStatus", "Error : " + ex.getLocalizedMessage());
		}
		
		return null;
	}
	
	public void saveEvents(Events e){
		Logger.info(this.getClass(), "saveEvents", "enter");
		try{
			IDataService ds = this.getDataService();
			ds.save(e);
		
		} catch (Exception ex) {
			Logger.error(this.getClass(), "saveEvents", "Error : " + ex.getLocalizedMessage());
		}
	
	}
	
	public void deleteEvents(String topology){
		Logger.log(this.getClass(), "deleteEvents", "enter > " + topology);
		try{
			IDataService ds = this.getDataService();
		
			ds.clear(topology, 0);
		
		} catch (Exception ex) {
			Logger.error(this.getClass(), "saveEvents", "Error : " + ex.getLocalizedMessage());
		}
	
	}
	
	public void deleteEvents(String topology, long millis){
		Logger.log(this.getClass(), "deleteEvents", "enter > " + topology + " > " + millis);
		try{
			IDataService ds = this.getDataService();
		
			ds.clear(topology, millis);
		
		} catch (Exception ex) {
			Logger.error(this.getClass(), "saveEvents", "Error : " + ex.getLocalizedMessage());
		}
	
	}

	public Map<String,Long> getEventStatistics(String id) {
	
		Logger.info(this.getClass(), "getEventStatistics", "enter");
		try{
			IDataService ds = this.getDataService();
			return ds.getEventStatistics(id);
		
		} catch (Exception ex) {
			Logger.error(this.getClass(), "saveEvents", "Error : " + ex.getLocalizedMessage());
		}
		
		return Collections.emptyMap();
	}
	


	public void setToplogy(Topology t){
		
		Gson g = new GsonBuilder().setPrettyPrinting().create();
		
		String json = g.toJson(t);
		
		KeyValueService s = new KeyValueService(Config.ToplogyFolder);
		
		s.set(t.getId(), json);
	}
	
	public Topology getToplogy(String id){
		
		Topology t = null;
		KeyValueService s = new KeyValueService(Config.ToplogyFolder);
		
		String json = s.get(id);
		if(json!=null){
			Gson g = new GsonBuilder().setPrettyPrinting().create();
			t = g.fromJson(json, Topology.class);
		}
	
		return t;
	}
	
	
//	public void setLayout(String id, TopologyLayout layout) {
//
//		
//		Gson g = new GsonBuilder().setPrettyPrinting().create();
//		
//		String json = g.toJson(layout);
//		KeyValueService s = new KeyValueService(Config.LayoutFolder);
//		s.set(id, json);
//	}
//	
//	public void getLayout(String id){
//
//		KeyValueService s = new KeyValueService(Config.LayoutFolder);
//			
//		String json = s.get(id);
//		if(json!=null){
//			Gson g = new GsonBuilder().setPrettyPrinting().create();
//			g.fromJson(json, Topology.class);
//		}
//	}
	
	public List<String> getTopolgies(){
		KeyValueService s = new KeyValueService(Config.ToplogyFolder);
		return s.getKeys();
	}
	
	public void close(){
		if(ds != null){
			try {
				ds.close();
			} catch (IOException e) {
				Logger.error(this.getClass(), "close", "Could not close DataService : " + e.getLocalizedMessage());
			}
		}
	}

	
	private IDataService getDataService() {
		if(ds == null){
			ds = new H2DataService(Config.H2Path);
		}
		return ds;
	}



	

	

}
