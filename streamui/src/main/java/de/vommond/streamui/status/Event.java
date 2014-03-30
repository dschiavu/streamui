package de.vommond.streamui.status;

import java.util.HashMap;

public class Event {
	
	private String topology, server, component, instance;
	
	private long start, end, count, duration;
	
	private HashMap<String, Boolean> booleans = new HashMap<String, Boolean>();
	 
	private HashMap<String, Long> longs = new HashMap<String, Long>();
	
	private HashMap<String, Double> doubles = new HashMap<String, Double>();
	
	private HashMap<String, Double> percents = new HashMap<String, Double>();

	public String getServer() {
		return server;
	}

	public void setServer(String server) {
		this.server = server;
	}

	public String getComponent() {
		return component;
	}

	public void setComponent(String component) {
		this.component = component;
	}

	public String getInstance() {
		return instance;
	}

	public void setInstance(String instance) {
		this.instance = instance;
	}

	public long getStart() {
		return start;
	}

	public void setStart(long start) {
		this.start = start;
	}

	public long getEnd() {
		return end;
	}

	public void setEnd(long end) {
		this.end = end;
	}

	public long getCount() {
		return count;
	}

	public void setCount(long count) {
		this.count = count;
	}

	public long getDuration() {
		return duration;
	}

	public void setDuration(long duration) {
		this.duration = duration;
	}

	public HashMap<String, Boolean> getBooleans() {
		return booleans;
	}

	public void setBoolean(String name, boolean value) {
		this.booleans.put(name, value);
	}

	public HashMap<String, Long> getLongs() {
		return longs;
	}

	public void setLongs(String name, long value) {
		this.longs.put(name, value);
	}

	public HashMap<String, Double> getDoubles() {
		return doubles;
	}

	public void setDoubles(String key, double value) {
		this.doubles.put(key, value);
	}

	public HashMap<String, Double> getPercents() {
		return percents;
	}

	public void setPercents(String key, double value) {
		this.percents.put(key, value);
	}

	public String getTopology() {
		return topology;
	}

	public void setTopology(String topology) {
		this.topology = topology;
	}

}
