package de.vommond.streamui.client;

public class Timer {
	
	private Instance parent;
	
	private long startInNamo;
	
	private String method;
	
	Timer(Instance parent, String method){
		this.startInNamo = System.nanoTime();
		this.method = method;
		this.parent = parent;
		
	}
	

	
	public void stop(){
		long stopInNano = System.nanoTime();
		
		parent.time(method, stopInNano-startInNamo);
	}
}
