import api from '../api/apiConn'


const getLocations = async () => {
    try {
        const res = await api.get('/locations')
        console.log(res.data)
        return res
    } catch (e) {
        console.log("An error occurred retrieving the locations: ", e)
    }
}

export const groupLocations = async () => {
    const getLocations = async () => {
        try {
            const res = await api.get('/locations')
            return res
        } catch (e) {
            console.log("An error occurred retrieving the locations: ", e)
        }
    }
    try {
      const locs = await getLocations();
      const locArray = locs.data;
  
      // Sort locations by state and city
      locArray.sort((a, b) => {
        const compareState = a.state.localeCompare(b.state);
        if (compareState !== 0) return compareState;
        return a.city.localeCompare(b.city);
      });
  
      // Group locations by state
      const groupedLocs = locArray.reduce((acc, location) => {
        const existingGroup = acc.find((group) => group.label === location.state);
  
        if (existingGroup) {
          existingGroup.options.push({
            label: `${location.district ? location.district + ', ' : ''}${location.city}`,
            value: location.id,
          });
        } else {
          acc.push({
            label: location.state,
            options: [
              {
                label: `${location.district ? location.district + ', ' : ''}${location.city}`,
                value: location.id,
              },
            ],
          });
        }
  
        return acc;
      }, []);
  
      // Add a group on top with "All" and an empty string value
      groupedLocs.unshift({
        label: "All",
        options: [{ label: "Any (Poland)", value: "" }],
      });
  
      return groupedLocs;
    } catch (error) {
        console.error("Error while grouping locations:", error);
      return [];
    }
  };