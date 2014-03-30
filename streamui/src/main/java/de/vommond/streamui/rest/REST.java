package de.vommond.streamui.rest;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import de.vommond.streamui.TopologyLayout;
import de.vommond.streamui.StreamUI;
import de.vommond.streamui.Topology;
import de.vommond.streamui.client.Events;
import de.vommond.streamui.status.TopologyStatus;
import de.vommond.util.KeyValueService;
import de.vommond.util.Logger;


@Path("v1")
public class REST {
	

	

	
	public REST(){

	}
	

	
    @GET
    @Produces(MediaType.TEXT_PLAIN)
    @Path("/topology/")
    public String getToplogyies() {
    	Logger.log(REST.class, "getToplogyies", "enter");

    	HashMap<String, Topology> result = new HashMap<String, Topology>();
    	
    	StreamUI ui = new StreamUI();
    	
    	List<String> ids = ui.getTopolgies();
    	for(String id : ids){
    		Topology topology = ui.getToplogy(id);
    		
//    		Map<String, Long> status = ui.getEventStatistics(id);
//    		long count =0;
//    		for(Long value : status.values())
//    			count+=value;
//    		topology.setEvents(count);
    		
    		
    		result.put(id, topology);
    	}
    
    	
    	
    	ui.close();
    	Gson g = new GsonBuilder().setPrettyPrinting().create();
    	return g.toJson(result);
    }
    
    
    @POST
    @Produces(MediaType.TEXT_PLAIN)
    @Path("/topology/{id}/layout")
    public Response setLayout(@PathParam("id") String id, String json) {
    	Logger.log(REST.class, "setLayout", "enter");
    
    	
    	
    	Gson g = new GsonBuilder().setPrettyPrinting().create();
    	TopologyLayout layout = g.fromJson(json, TopologyLayout.class);
    	
    	StreamUI ui = new StreamUI();
    	
    	Topology t = ui.getToplogy(id);
    	if(t!=null){
    		t.setLayout(layout);
    		ui.setToplogy(t);
    	   	ui.close();
    		return Response.status(200).build();
    	}
    	Logger.error(REST.class, "setLayout", "Error : No topolgz with id " + id );
       	ui.close();
 
    	
    	
    	return Response.status(404).build();
    }
    
    
	
    @GET
    @Produces(MediaType.TEXT_PLAIN)
    @Path("/topology/{id}.json")
    public String getToplogy(@PathParam("id") String id) {
    	Logger.log(REST.class, "getToplogy", "enter");

    
    	StreamUI ui = new StreamUI();
    	Topology t =  ui.getToplogy(id);
     	ui.close();
     	
     	if(t!=null){
         	Gson g = new GsonBuilder().setPrettyPrinting().create();
         	return g.toJson(t);
     	} else {
        	Logger.error(REST.class, "getToplogy", "No toplogy with id " + id);
     	}

    	
     	
     	return "{}";
    }

    
   
	 
	 @GET
	 @Produces(MediaType.TEXT_PLAIN)
	 @Path("/topology/{id}/status/components.json")
	 public String getComponentStatus(@PathParam("id") String id , @QueryParam("seconds") long seconds) {
	    	Logger.info(REST.class, "getComponentStatus(seconds)", "enter");

	    	long now = System.currentTimeMillis();
	    	
	    
	    	StreamUI ui = new StreamUI();
	    	TopologyStatus t =  ui.getComponentStatus(id, now -(seconds * 1000) , now);
	     	ui.close();
	     	
	     	Gson g = new GsonBuilder().setPrettyPrinting().create();
	     	
	     	return g.toJson(t);
	 }
	
	 
	 
	 @GET
	 @Produces(MediaType.TEXT_PLAIN)
	 @Path("/topology/{id}/events/")
	 public String getEvents(@PathParam("id") String id ) {
	    	Logger.log(REST.class, "getEvents", "enter");

	    	StreamUI ui = new StreamUI();
	    	Map<String,Long> map = ui.getEventStatistics(id);
	     	ui.close();
	     	
	     	Gson gson = new GsonBuilder().create();
	     	return gson.toJson(map);	
	 }

	 
	 @POST
	 @Produces(MediaType.TEXT_PLAIN)
	 @Path("/topology/{id}/events/")
	 public String setEvents(@PathParam("id") String id , String json) {
	    	Logger.log(REST.class, "setEvents", "enter");

	    
	    	StreamUI ui = new StreamUI();
	    	Gson gson = new GsonBuilder().create();	
	    	Events events = gson.fromJson(json, Events.class);
	    	ui.saveEvents(events);
	     	ui.close();
	     	
	     	
	     	return "[]";
	     	
	     	
	 }
	 
	 @DELETE
	 @Produces(MediaType.TEXT_PLAIN)
	 @Path("/topology/{id}/events/")
	 public String deleteEvents(@PathParam("id") String id) {
	    	Logger.log(REST.class, "deleteEvents", "enter");

	    	StreamUI ui = new StreamUI();
	    	ui.deleteEvents(id);
	     	ui.close();
	     	
	     	
	     	return "[]";  	
	     	
	 }
	 
	 /*****************************************
	  * Key Value
	  *****************************************/
    
    
    @GET
    @Produces(MediaType.TEXT_PLAIN)
    @Path("/kvs/{key}.json")
    public String getKey(@PathParam("key") String key) {
    	Logger.log(REST.class, "getKey", "enter");

    
    	KeyValueService s = new KeyValueService();
    	return s.get(key);
    	
    }
    
    @POST
    @Produces(MediaType.TEXT_PLAIN)
    @Path("/kvs/{key}.json")
    public String setKey(@PathParam("key") String key, String value) {
    	Logger.log(REST.class, "setKey", "enter");

    
    	KeyValueService s = new KeyValueService();
    	s.set(key, value);
    	
    	return "{result:1}";
    }
    
    
}
