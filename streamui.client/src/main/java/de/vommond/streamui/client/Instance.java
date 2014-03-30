package de.vommond.streamui.client;

import java.util.HashMap;

import org.apache.mahout.math.map.OpenDoubleLongHashMap;
import org.apache.mahout.math.map.OpenObjectDoubleHashMap;
import org.apache.mahout.math.map.OpenObjectLongHashMap;

public class Instance {
	
	 final String server, component, instance;
	 
	  boolean dirty = false;
	  
	 // OpenObjectLongHashMap<String> acks = new OpenObjectLongHashMap<String>();
	
	 OpenObjectLongHashMap<String> counts = new OpenObjectLongHashMap<String>();
	
	 OpenObjectLongHashMap<String> receives = new OpenObjectLongHashMap<String>();
	
	 OpenObjectLongHashMap<String> emits = new OpenObjectLongHashMap<String>(); 
	
	 OpenObjectDoubleHashMap<String> numberValues = new OpenObjectDoubleHashMap<String>();
	
	 OpenObjectLongHashMap<String> numberCounts = new OpenObjectLongHashMap<String>();
	
	 OpenObjectLongHashMap<String> timeValues = new OpenObjectLongHashMap<String>();
	
	 OpenObjectLongHashMap<String> timeCounts = new OpenObjectLongHashMap<String>();
	
	 OpenObjectLongHashMap<String> trueCounts = new OpenObjectLongHashMap<String>();
	
	 OpenObjectLongHashMap<String> falseCounts = new OpenObjectLongHashMap<String>();
	
	 HashMap<String,OpenDoubleLongHashMap> distributions = new HashMap<String,OpenDoubleLongHashMap>();

	public Instance(String server, String component, String instance) {
		super();
		this.server = server;
		this.component = component;
		this.instance = instance;
	}
	
	synchronized void reset(){
		counts.clear();
		emits.clear();
		receives.clear();
		numberCounts.clear();
		numberValues.clear();
		timeCounts.clear();
		timeValues.clear();
		trueCounts.clear();
		falseCounts.clear();
		distributions.clear();
		//acks.clear();
		dirty = false;
	}
	
//	
//	/**
//	 * Count events received by an instance.
//	 * 
//	 * @param source
//	 * 			The name of the source
//	 */
//	public void ack(String id){
//		long now = System.currentTimeMillis();
//		acks.put(id, now);
//		dirty= true;
//	}
//	
	
	
	/**
	 * Count events received by an instance.
	 * 
	 * @param source
	 * 			The name of the source
	 */
	public void receive(String source){
		receives.adjustOrPutValue(source, 1, 1);
		dirty= true;
	}
	
	/**
	 * Counts events that are emited by an instance
	 * @param source
	 */
	public void emit(String source){
		emits.adjustOrPutValue(source, 1, 1);
		dirty= true;
	}

	/**
	 * Monitors the invocation if a method and the time it used to 
	 * execute.
	 * 
	 * @param method
	 * 	The name of the method that was invoked
	 */
	public Timer method(String method){
		return new Timer(this, method);
	}

	
	/**
	 * Log time for some aspect, e.g. how long a method took
	 * 
	 * @param aspect
	 * 			The aspect you want to monitor time for
	 * @param duration
	 * 			The duration in nanoseconds
	 */
	public void time(String method, long nanos) {
		timeValues.adjustOrPutValue(method, nanos, nanos);
		timeCounts.adjustOrPutValue(method, 1, 1);
		dirty= true;
	}

	
	/**
	 * Count some aspect, e.g. the number of loops. The method 
	 * will increment the counter of the aspect.
	 * 
	 * @param string
	 * 			The name of the aspect to count
	 */
	public void count(String string) {
		counts.adjustOrPutValue(string, 1, 1);
		dirty= true;
	}
	
	
	
	/**
	 * Save some numerical aspects, e.g. elements
	 * in result set. 
	 * 
	 * Some statistics will be computed, e.g. mean
	 * 
	 * @param aspect
	 * 			The aspect to monitor
	 * 	
	 * @param value
	 * 			The value to store
	 */
	public void number(String aspect, double value) {
		numberValues.adjustOrPutValue(aspect, value, value);
		numberCounts.adjustOrPutValue(aspect, 1, 1);
		dirty= true;
	}
	
	
	
	/**
	 * Save some binary aspects, e.g. elements
	 * true or false results
	 * 
	 * The ratio of true and false will be computed
	 * 
	 * @param aspect
	 * 			The aspect to monitor
	 * 	
	 * @param value
	 * 			The value to store
	 */
	public void binary(String aspect, boolean value) {
		if(value){
			trueCounts.adjustOrPutValue(aspect, 1, 1);
		}else {
			falseCounts.adjustOrPutValue(aspect, 1, 1);
		}
		dirty= true;
	}
	
	/**
	 * Monitor the distribution over some stochastic variable. 
	 * The distribution is stored as an histogram
	 * 
	 * @param aspect
	 * 			The aspect o monitor
	 * @param value
	 * 			The value of to store
	 */
	public void distribution(String aspect, double value) {
		if(!distributions.containsKey(aspect)){
			distributions.put(aspect, new OpenDoubleLongHashMap());
		}
		distributions.get(aspect).adjustOrPutValue(value, 1, 1);
		dirty= true;
	}
	
	
}
