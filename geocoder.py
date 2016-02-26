import urllib2
import json

addressArraysToGeocode = [
	["6679 Delmar Boulevard, University City, MO"],
	["6665 Delmar Boulevard, University City, MO"],
	["7278 Manchester Road, Maplewood, MO"],
	["20 South Belt West, Belleville, IL"],
	["1004 Locust Street, St. Louis, MO"],
	["3422 South Jefferson Avenue, St. Louis, MO"],
	["2336 Woodson Road, Overland, MO"],
	["1637 South 18th Street, St. Louis, MO"],
	["1504 South Compton Avenue, St. Louis, MO"],
	["114 West Mill Street, Waterloo, IL"],
	["4127 Manchester Avenue, St. Louis, MO"],
	["3500 Watson Road, St. Louis, MO"],
	["7847 North Lindbergh Boulevard, Hazelwood, MO"],
	["9568 Manchester Road, Rock Hill, MO"],
	["2801 Cherokee Street, St. Louis, MO"],
	["1327 Washington Avenue, St. Louis, MO"],
	["2212 South Jefferson Avenue, St. Louis, MO"],
	["8106 Olive Boulevard, University City, MO"],
	["7322 Manchester Road, Maplewood, MO"],
	["6 North Sarah Street, St. Louis, MO"],
	["14536 Manchester Road, Winchester, MO"],
	["14031 Manchester Road, St. Louis, MO"],
	["3108 Olive Street, St. Louis, MO"],
	["4258 Schiller Place, St. Louis, MO"],
	["8604 Olive Boulevard, University City, MO"],
	["1629 Tower Grove Avenue, St. Louis, MO"],
	["40 North Central Avenue, Clayton, MO"]
]

print addressArraysToGeocode

for array in addressArraysToGeocode:
	output = ''
	# Usually only one address, but sometimes more
	if array is not None:
		for address in array:
			address = address.replace(' ','+')
			url = "https://maps.googleapis.com/maps/api/geocode/json?address=%s" % address
			response = urllib2.urlopen(url)
			jsonData = response.read()
			if jsonData:
				data = json.loads(jsonData)
				if data['status'] == "OK":
					if len(data['results']) == 1:
						new_address = data['results'][0]['formatted_address'].replace(', USA','')
						lat = data['results'][0]['geometry']['location']['lat']
						lng = data['results'][0]['geometry']['location']['lng']
					output = output + str(new_address) + '\t ' + str(lat) + ',' + str(lng) + ';'
				else:
					print 'error' + str(data);
		# Remove tailing semicolon
		output = output.rstrip(';')
	print output
