package de.vommond.streamui.client;

import org.junit.Test;


public class ApiDemo {

	/**
	 * Basic usage of the API
	 */
	@Test
	public void testAPI(){
		
		/**
		 * Create client object
		 * 
		 * TODO: Could be nicer. URL could be somehow configured
		 */
		StreamUIClient client = new StreamUIClient("http://localhost:8080/streamui/", "topology1");
		
		/**
		 * Create an status for each java object you want to monitor
		 */
		Instance instance = client.createInstance("localhorst", "Compo1", "instance1");
		
		
		/**
		 * Stop method execution time
		 */
		Timer t = instance.method("testMethod");
		t.stop();
		
		
		/**
		 * String aspect
		 */
		instance.count("aspect");
		
		/**
		 * Binary
		 */
		instance.binary("bin", true);
		instance.binary("bin", true);
		instance.binary("bin", false);
		
		/**
		 * Distribution
		 */
		instance.distribution("hist", 1);
		instance.distribution("hist", 2);
		instance.distribution("hist", 1);
		instance.distribution("hist", 3);
		
		
		/**
		 * some numbers
		 */
		instance.number("number", 10);
		
		/**
		 * receive an event
		 */
		instance.receive("input1");
		
		/**
		 * emit an event
		 */
		instance.emit("output1");
		
		

		
		client.flush();
	
	}
}
