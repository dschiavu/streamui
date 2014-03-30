package de.vommond.util;

public class Logger {
	
	public static int LOG_DEBUG = 4;
	
	public static int LOG_TRACE = 3;

	public static int LOG_LOG = 2;

	public static int LOG_ERROR = 1;
	
	
	/**
	 *  Config
	 */
	public static int logLevel = 3;
	
	public static String prefix;
	
	public static void debug(Class<?> clazz, String method, String message) {
		if (logLevel >= LOG_DEBUG) {
			print("Debug", clazz, method, message);
		}
	}

	
	
	public static void info(Class<?> clazz, String method, String message) {
		if (logLevel >= LOG_TRACE) {
			print("Info", clazz, method, message);

		}
	}
		
	
	
	public static void info(Class<?> clazz, String method, String message, Object i) {
		if (logLevel >= LOG_TRACE) {
			print("Info", clazz, method, message + " > " + i);

		}
	}

	public static void log(Class<?> clazz, String method, String message) {
		if (logLevel >= LOG_LOG) {
			print("Log", clazz, method, message);
		}
	}
	
	public static void log(Class<?> clazz, String method, String message,Object p) {
		if (logLevel >= LOG_LOG) {
			print("Log", clazz, method, message + p);
		}
	}

	public static void error(Class<?> clazz, String method, String message) {
		String  m = clazz.getSimpleName() + "." + method + "() >" + message;	
		System.err.println("Error : " + m);
	}
	
	private static void print(String prefix, Class<?> clazz, String method, String message){
		
		String  m = getMessage(clazz, method, message);
		if(m!=null){
			System.out.println(  prefix+ " : " + m);
		}
	}
	
	private static String getMessage(Class<?> clazz, String method, String message){
		String m = clazz.getSimpleName() + "." + method + "() >" + message;	
		if(prefix == null || m.startsWith(prefix) ){
			return m;
		}
		return null;
	}

	

	
}
