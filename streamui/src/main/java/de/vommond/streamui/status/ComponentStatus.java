package de.vommond.streamui.status;

import java.util.HashMap;


public class ComponentStatus {
	
	private final String id;
	
	private int instances;
	
	private HashMap<String, Long> counts = new HashMap<String, Long>();
	
	private HashMap<String, Long> emits = new HashMap<String, Long>();
	
	private HashMap<String, Long> receives = new HashMap<String, Long>();

	private HashMap<String, Double> numberMean = new HashMap<String, Double>();
	
	private HashMap<String, Long> timeMean = new HashMap<String, Long>();
	
	private HashMap<String, Double> truesPercentage = new HashMap<String, Double>();
	
	private HashMap<String, HashMap<Double, Long>> distribution = new HashMap<String,  HashMap<Double, Long>>();

	public ComponentStatus(String id){
		this.id = id;
	}
	
	public String getId() {
		return id;
	}

	
	public int getInstances() {
		return instances;
	}

	public void setInstances(int instances) {
		this.instances = instances;
	}
	
	
	public void addCount(String aspect, long count){
		this.counts.put(aspect, count);
	}
	
	public void addEmit(String aspect, long count){
		this.emits.put(aspect, count);
	}
	
	
	public void addReceive(String aspect, long count){
		this.receives.put(aspect, count);
	}
	
	
	public void addTimeMean(String aspect, long count){
		this.timeMean.put(aspect, count);
	}
	
	
	public void addNumberMean(String aspect, double count){
		this.numberMean.put(aspect, count);
	}
	
	public void addTruesPercentage(String aspect, Double count){
		this.truesPercentage.put(aspect, count);
	}
	
	public void addDistrubtion(String aspect, double value, long count){
		if(!this.distribution.containsKey(aspect)){
			this.distribution.put(aspect, new HashMap<Double, Long>());
		}
		this.distribution.get(aspect).put(value, count);
	}

	public HashMap<String, Long> getCounts() {
		return counts;
	}

	public HashMap<String, Long> getEmits() {
		return emits;
	}

	public HashMap<String, Long> getReceives() {
		return receives;
	}

	public HashMap<String, Double> getNumberMean() {
		return numberMean;
	}

	public HashMap<String, Long> getTimeMean() {
		return timeMean;
	}

	public HashMap<String, Double> getTruesPercentage() {
		return truesPercentage;
	}

	public HashMap<String, HashMap<Double, Long>> getDistribution() {
		return distribution;
	}
}
