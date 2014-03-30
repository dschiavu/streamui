package de.vommond.streamui.client;

import java.util.ArrayList;
import java.util.HashMap;

import javax.ws.rs.client.Client;
import javax.ws.rs.client.ClientBuilder;
import static javax.ws.rs.client.Entity.entity;
import javax.ws.rs.core.MediaType;

import org.apache.mahout.math.function.DoubleLongProcedure;
import org.apache.mahout.math.function.ObjectLongProcedure;
import org.apache.mahout.math.map.OpenDoubleLongHashMap;
import org.apache.mahout.math.map.OpenObjectDoubleHashMap;
import org.apache.mahout.math.map.OpenObjectLongHashMap;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;




public class StreamUIClient {

	
	private ArrayList<Instance> instances = new ArrayList<Instance>();
	
	private long time = 20*1000;
	
	private String url;
	
	private String topology;

	
	public StreamUIClient(String url, String topology) {
		this.url = url;
		this.topology = topology;
		init();
	}
	
	public StreamUIClient(String url, String topology, long time) {
		this.time = time;
		this.topology = topology;
		this.url = url;
		init();
	}

	public boolean flush(){
		
		try{
			Events events = buildEvents();
			
			Gson gson =new GsonBuilder().create();
			String json = gson.toJson(events);
			
			String path = "/rest/v1/topology/" +this.topology + "/events";
			
			System.out.println(path);
			
			Client client = ClientBuilder.newClient();
			
		
			 
			int response = client
					.target(this.url)
					.path(path)
					.request(MediaType.TEXT_PLAIN_TYPE)
					.post(entity(json,MediaType.TEXT_PLAIN_TYPE ))
					.getStatus();
				
			if(response == 200){
				return true;
			}

		} catch(Exception e){
			e.printStackTrace();
		}
		
	    return false; 
		
	}


	 Events buildEvents(){
		
		final Events events = new Events(this.topology);
		
		for(Instance instance : instances){
			
			if(instance.dirty){
				
				final String s = instance.server;
				final String i = instance.instance;
				final String c = instance.component;
				
				OpenObjectLongHashMap<String> counts = instance.counts;
				counts.forEachPair(new ObjectLongProcedure<String>() {
					public boolean apply(String aspect, long value) {
						CountEvent e = new CountEvent(s,c,i, aspect, value);
						events.add(e);
						
						return true;
					}
				});
				
				
				OpenObjectLongHashMap<String> emits = instance.emits;
				emits.forEachPair(new ObjectLongProcedure<String>() {
					public boolean apply(String aspect, long value) {
						EmitEvent e = new EmitEvent(s,c,i, aspect, value);
						events.add(e);
						return true;
					}
				});

//				OpenObjectLongHashMap<String> acks = instance.acks;
//				acks.forEachPair(new ObjectLongProcedure<String>() {
//					public boolean apply(String aspect, long value) {
//						AcknowledgeEvent e = new AcknowledgeEvent(s,c,i, aspect, value);
//						events.add(e);
//						return true;
//					}
//				});
				
				
				OpenObjectLongHashMap<String> receives = instance.receives;
				receives.forEachPair(new ObjectLongProcedure<String>() {
					public boolean apply(String aspect, long value) {
						ReceiveEvent e = new ReceiveEvent(s,c,i, aspect, value);
						events.add(e);
						return true;
					}
				});
				
				OpenObjectLongHashMap<String> numberCounts = instance.numberCounts;
				final OpenObjectDoubleHashMap<String> numberValues = instance.numberValues;
				numberCounts.forEachPair(new ObjectLongProcedure<String>() {
					public boolean apply(String aspect, long count) {
						NumberEvent e = new NumberEvent(s,c,i, aspect, numberValues.get(aspect), count);
						events.add(e);
						return true;
					}
				});
				
				
				OpenObjectLongHashMap<String> timeCounts = instance.timeCounts;
				final OpenObjectLongHashMap<String> timeValues = instance.timeValues;
				timeCounts.forEachPair(new ObjectLongProcedure<String>() {
					public boolean apply(String aspect, long count) {
						TimeEvent e = new TimeEvent(s,c,i, aspect, timeValues.get(aspect), count);
						events.add(e);
						return true;
					}
				});
				
				
				OpenObjectLongHashMap<String> trueCounts = instance.trueCounts;
				final OpenObjectLongHashMap<String> falseCounts = instance.falseCounts;
				trueCounts.forEachPair(new ObjectLongProcedure<String>() {
					public boolean apply(String aspect, long trueCounts) {
						BooleanEvent e = new BooleanEvent(s,c,i, aspect, trueCounts, falseCounts.get(aspect));
						events.add(e);
						return true;
					}
				});
				
				
				
				HashMap<String, OpenDoubleLongHashMap> dist = instance.distributions;
				for(String aspect : dist.keySet()){
					
					OpenDoubleLongHashMap values = dist.get(aspect);
					
					final HashMap<Double, Long> distribution = new HashMap<Double, Long>();
					values.forEachPair(new DoubleLongProcedure() {
						public boolean apply(double key, long value) {
							distribution.put(key, value);
							return true;
						}
					});
					
					DistributionEvent e = new DistributionEvent(s, c, i, aspect, distribution);
					events.add(e);
					
				}
				
				instance.reset();
			}

			
		}
		
		
		
		
		
		return events;
		
	}
	
	

	
	public Instance createInstance(String server, String component, String instance){
		init();
		Instance i =  new Instance(server,component,instance);
		instances.add(i);
		return i ;
	}


	private void init() {
		/**
		 * Create thread if not created. We must check it every time, due to the
		 * way Storm serializes objects.
		 * 
		 */
	}
}
