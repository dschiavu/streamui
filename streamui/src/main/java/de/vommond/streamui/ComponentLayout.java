package de.vommond.streamui;

import java.util.ArrayList;

public class ComponentLayout {

	private int x,y,w,h;

	private ArrayList<DashletLayout> dashletLayout = new ArrayList<DashletLayout>();
	
	public int getX() {
		return x;
	}

	public void setX(int x) {
		this.x = x;
	}

	public int getY() {
		return y;
	}

	public void setY(int y) {
		this.y = y;
	}

	public int getW() {
		return w;
	}

	public void setW(int w) {
		this.w = w;
	}

	public int getH() {
		return h;
	}

	public void setH(int h) {
		this.h = h;
	}

	public ArrayList<DashletLayout> getDashletLayout() {
		return dashletLayout;
	}

	public void setDashletLayout(ArrayList<DashletLayout> dashletLayout) {
		this.dashletLayout = dashletLayout;
	}
}
