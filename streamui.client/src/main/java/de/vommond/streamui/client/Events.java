package de.vommond.streamui.client;

import java.util.ArrayList;

public class Events {

	private ArrayList<BooleanEvent> bools = new ArrayList<BooleanEvent>();
	
	private ArrayList<CountEvent> counts = new ArrayList<CountEvent>();
	
	private ArrayList<ReceiveEvent> receives = new ArrayList<ReceiveEvent>();
	
	private ArrayList<EmitEvent> emits = new ArrayList<EmitEvent>();
	
	private ArrayList<NumberEvent> numbers = new ArrayList<NumberEvent>();
	
	private ArrayList<TimeEvent> time = new ArrayList<TimeEvent>();
	
	private ArrayList<AcknowledgeEvent> acks = new ArrayList<AcknowledgeEvent>();
	
	private ArrayList<DistributionEvent> distributions = new ArrayList<DistributionEvent>();
	
	private final long timestamp = System.currentTimeMillis();
	
	private final String topology;
	
	public Events(String topology){
		this.topology = topology;
	}

	public ArrayList<BooleanEvent> getBools() {
		return bools;
	}

	public ArrayList<ReceiveEvent> getReceives() {
		return receives;
	}

	public ArrayList<EmitEvent> getEmits() {
		return emits;
	}



	public ArrayList<TimeEvent> getTime() {
		return time;
	}

	public ArrayList<DistributionEvent> getDistributions() {
		return distributions;
	}

	public ArrayList<CountEvent> getCounts() {
		return counts;
	}

	public boolean add(BooleanEvent e) {
		return bools.add(e);
	}

	public boolean add(CountEvent e) {
		return counts.add(e);
	}

	public boolean add(EmitEvent e) {
		return emits.add(e);
	}



	public void add(TimeEvent element) {
		time.add(element);
	}
	
	public void add(AcknowledgeEvent e) {
		acks.add(e);
	}

	public boolean add(DistributionEvent e) {
		return distributions.add(e);
	}

	public void add(ReceiveEvent e) {
		receives.add(e);
		
	}

	public void add(NumberEvent e) {
		numbers.add(e);
	}

	public ArrayList<NumberEvent> getNumbers() {
		return numbers;
	}

	public long getTimestamp() {
		return timestamp;
	}

	public String getTopology() {
		return topology;
	}

	public ArrayList<AcknowledgeEvent> getAcks() {
		return acks;
	} 
	
}
