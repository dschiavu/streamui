package de.vommond.util;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import de.vommond.streamui.Config;

public class KeyValueService {
	
	private final String path;
	
	
	public KeyValueService(){
		this(Config.KeyValuePath);
	}
	
	public KeyValueService(String path){
		this.path = path;
	}
	
	
	public void set(String key, String value){
		Logger.info(KeyValueService.class, "set", "enter");
		
		
		try {
			FileWriter w = new FileWriter(getFile(key));
			w.write(value);
			w.close();
		} catch (IOException e) {
			Logger.error(KeyValueService.class, "set", "Error : " + key + " > " + e.getLocalizedMessage());
		}
	}

	public File getFile(String key) {
		return new File(path+"/" + key+".json");
	}
	
	public String get(String key){
		Logger.info(KeyValueService.class, "get", "enter", key);
		try {
			File f = getFile(key);
			if(!f.exists()){
				Logger.info(KeyValueService.class, "get", "exit > no key", key);
				System.out.println(f.getAbsolutePath());
				return null;
			}
			FileReader r = new FileReader(f);
			BufferedReader bf = new BufferedReader(r);
	
			StringBuffer result = new StringBuffer();
			
			String line = bf.readLine();
			while(line!=null){
				result.append(line);
				result.append("\n");
				line = bf.readLine();
			}
			bf.close();
		
			return result.toString();
		} catch (IOException e) {
			Logger.error(KeyValueService.class, "set", "Error : " + key + " > " + e.getLocalizedMessage());
		}
		
		return null;
	}

	public List<String> getKeys() {
		Logger.info(KeyValueService.class, "getKeys", "enter");
		List<String> list = new ArrayList<String>();
		
		try {
			File f = new File(path);
			if(!f.exists()){
				Logger.error(KeyValueService.class, "get", "exit > No path : " + f.getAbsolutePath());
				return null;
			}
			if(!f.isDirectory()){
				Logger.error(KeyValueService.class, "get", "exit > No dir");
			}
			
			String[] files = f.list();
			for(String file : files){
				int pos = file.indexOf(".json");
				if(pos > 0){
					list.add(file.substring(0, pos));
				}
			}
		
		} catch (Exception e) {
			Logger.error(KeyValueService.class, "set", "Error : " + e.getLocalizedMessage());
		}
		Logger.info(KeyValueService.class, "getKeys", "exit >"  + list.size());
		return list;
	}

}
