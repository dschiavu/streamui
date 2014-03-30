package de.vommond.streamui.jdbc;

import java.io.IOException;
import java.util.Collection;
import java.util.HashMap;
import java.util.Map;

import org.junit.Assert;
import org.junit.Test;

import de.vommond.streamui.client.BooleanEvent;
import de.vommond.streamui.client.CountEvent;
import de.vommond.streamui.client.DistributionEvent;
import de.vommond.streamui.client.EmitEvent;
import de.vommond.streamui.client.Events;
import de.vommond.streamui.client.NumberEvent;
import de.vommond.streamui.client.ReceiveEvent;
import de.vommond.streamui.client.TimeEvent;
import de.vommond.streamui.data.H2DataService;
import de.vommond.streamui.data.IDataService;
import de.vommond.streamui.status.ComponentStatus;
import de.vommond.streamui.status.InstanceStatus;
import de.vommond.streamui.status.TopologyStatus;

public class DataServiceTest {

	
	@Test
	public void testJDBC() throws InterruptedException, IOException{
		
		
		
		H2DataService ds = new H2DataService("/Users/klaus_schaefers/Documents/workspaces/Kepler/streamui/src/main/webapp/h2");
		test(ds);
		
		ds.close();
	}
	
	

	
	
	
	private void test(IDataService ds) throws InterruptedException {
		testStore(ds);
	}






	public void testStore(IDataService ds) throws InterruptedException{
		ds.clear("topologytest",System.currentTimeMillis());
		
		/**
		 * save()
		 */
		Events e = createEvent("topologytest", "localhorst", "spoud1", "instance1");
		int inserts = ds.save(e);
		Assert.assertEquals(10, inserts);
		
		e = createEvent("topologytest", "localhorst2", "bolt", "instance2");
		inserts = ds.save(e);
		Assert.assertEquals(10, inserts);
		
		e = createEvent("topologytest", "localhorst2", "bolt", "instance3");
		inserts = ds.save(e);
		Assert.assertEquals(10, inserts);
		
		
		/**
		 * getServer()
		 */
		Collection<String> servers = ds.getServer("topologytest", 0);
		Assert.assertEquals(2, servers.size());
		Assert.assertTrue(servers.contains("localhorst"));
		Assert.assertTrue(servers.contains("localhorst2"));
		
		/**
		 * getInstances()
		 */
		Collection<String> instances = ds.getInstances("topologytest", 0);
		Assert.assertEquals(3, instances.size());
		Assert.assertTrue(instances.contains("instance1"));
		Assert.assertTrue(instances.contains("instance2"));
		Assert.assertTrue(instances.contains("instance3"));
		
		/**
		 * getComponents()
		 */
		Collection<String> components = ds.getComponents("topologytest", 0);
		Assert.assertEquals(2, components.size());
		Assert.assertTrue(components.contains("spoud1"));
		Assert.assertTrue(components.contains("bolt"));
		
		
		/**
		 * getComponentStatus()
		 */
		TopologyStatus status =  ds.getComponentStatus("topologytest", 0, System.currentTimeMillis());
		
		ComponentStatus spoud1 = status.getComponent("spoud1");
		ComponentStatus bolt = status.getComponent("bolt");
		assertComponentStatus(spoud1, bolt);
		
		
			
		
		/**
		 * getInstanceStatus()
		 */
		status= ds.getInstanceStatus("topologytest", 0, System.currentTimeMillis());
		this.assertInstanceStatus(status.getInstance("instance1"));
		this.assertInstanceStatus(status.getInstance("instance2"));
		this.assertInstanceStatus(status.getInstance("instance3"));
		
		
		/**
		 * getEventStatistics
		 */
		Map<String,Long> counts = ds.getEventStatistics("topologytest");
		Assert.assertEquals(6, counts.get("boolean").longValue());
		Assert.assertEquals(3, counts.get("count").longValue());
		Assert.assertEquals(3, counts.get("emit").longValue());
		Assert.assertEquals(3, counts.get("receive").longValue());
		Assert.assertEquals(3, counts.get("number").longValue());
		Assert.assertEquals(3, counts.get("time").longValue());
		Assert.assertEquals(9, counts.get("dist").longValue());
		
		/**
		 * clear()
		 */
		int delete = ds.clear("topologytest",System.currentTimeMillis());
		Assert.assertEquals(30, delete);
	
	}



	private void assertInstanceStatus(InstanceStatus spoud1) {
		// boolean
		Assert.assertEquals(spoud1.getTruesPercentage().get("boolean1"), 0.4d, 0);
		Assert.assertEquals(spoud1.getTruesPercentage().get("boolean2"), 4d / 9d, 0);
	
		// count
		Assert.assertEquals(spoud1.getCounts().get("count").longValue(), 1000l);

		// emit
		Assert.assertEquals(spoud1.getEmits().get("output1").longValue(), 2000l);

		// receive
		Assert.assertEquals(spoud1.getReceives().get("input1").longValue(), 3000l);

		
		// time
		Assert.assertEquals(spoud1.getTimeMean().get("time").longValue(), 500l);
		
		
		// number
		Assert.assertEquals(spoud1.getNumberMean().get("number").longValue(), 1000l);
	
		
		// dist
		Assert.assertEquals(spoud1.getDistribution().get("dist").get(2d).longValue(), 4l);
		Assert.assertEquals(spoud1.getDistribution().get("dist").get(3d).longValue(), 20l);
		Assert.assertEquals(spoud1.getDistribution().get("dist").get(1d).longValue(), 10l);
	
	}


	private void assertComponentStatus(ComponentStatus spoud1, ComponentStatus bolt) {
		// boolean
		Assert.assertEquals(spoud1.getTruesPercentage().get("boolean1"), 0.4d, 0);
		Assert.assertEquals(spoud1.getTruesPercentage().get("boolean2"), 4d / 9d, 0);
		Assert.assertEquals(bolt.getTruesPercentage().get("boolean2"), 4d / 9d, 0);
		// count
		Assert.assertEquals(spoud1.getCounts().get("count").longValue(), 1000l);
		Assert.assertEquals(bolt.getCounts().get("count").longValue(), 2000l);
		// emit
		Assert.assertEquals(spoud1.getEmits().get("output1").longValue(), 2000l);
		Assert.assertEquals(bolt.getEmits().get("output1").longValue(), 4000l);
		// receive
		Assert.assertEquals(spoud1.getReceives().get("input1").longValue(), 3000l);
		Assert.assertEquals(bolt.getReceives().get("input1").longValue(), 6000l);
		
		// time
		Assert.assertEquals(spoud1.getTimeMean().get("time").longValue(), 500l);
		Assert.assertEquals(bolt.getTimeMean().get("time").longValue(), 500l);
		
		// number
		Assert.assertEquals(spoud1.getNumberMean().get("number").longValue(), 1000l);
		Assert.assertEquals(bolt.getNumberMean().get("number").longValue(), 1000l);
		
		// dist
		Assert.assertEquals(spoud1.getDistribution().get("dist").get(2d).longValue(), 4l);
		Assert.assertEquals(spoud1.getDistribution().get("dist").get(3d).longValue(), 20l);
		Assert.assertEquals(spoud1.getDistribution().get("dist").get(1d).longValue(), 10l);
		Assert.assertEquals(bolt.getDistribution().get("dist").get(2d).longValue(), 8l);
		Assert.assertEquals(bolt.getDistribution().get("dist").get(3d).longValue(), 40l);
		Assert.assertEquals(bolt.getDistribution().get("dist").get(1d).longValue(), 20l);
	}
	
	private Events createEvent(String t, String server, String component, String instance ){
		Events e = new Events(t);
		
		e.add(new BooleanEvent(server, component, instance, "boolean1", 2, 3));
		e.add(new BooleanEvent(server, component, instance, "boolean2", 4,5));
		e.add(new CountEvent(server, component, instance, "count", 1000));
		e.add(new EmitEvent(server, component, instance, "output1", 2000));
		e.add(new ReceiveEvent(server, component, instance, "input1", 3000));
		e.add(new NumberEvent(server, component, instance, "number", 4000, 4));
		e.add(new TimeEvent(server, component, instance, "time", 1000l, 2));
	
	
		HashMap<Double, Long> d = new HashMap<Double, Long>();
		d.put(2d, 4l);
		d.put(3d, 20l);
		d.put(1d, 10l);
		e.add(new DistributionEvent(server, component, instance, "dist", d));
		
		
		return e;
	}
}
