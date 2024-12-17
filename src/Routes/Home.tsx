import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, TextInput, Modal, FlatList } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import NavBar from '../components/NavBar.tsx';

function Home({ route }) {

  const [active, setActive] = useState('today');
  const [modalVisible, setModalVisible] = useState(false); 
  const [editModalVisible, setEditModalVisible] = useState(false); 
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');


  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [day, setDay] = useState('');
  const [hour, setHour] = useState('');
  const [minute, setMinute] = useState('');

  
  const [endYear, setEndYear] = useState('');
  const [endMonth, setEndMonth] = useState('');
  const [endDay, setEndDay] = useState('');
  const [endHour, setEndHour] = useState('');
  const [endMinute, setEndMinute] = useState('');

  const [currentDate, setCurrentDate] = useState(new Date());
  const [error, setError] = useState('');
  const [allEvents, setAllEvents] = useState([]);

  
  const [optionModalVisible, setOptionModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {

    const interval = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);


  const formatDate = (date: Date) => {
    return `${date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}, ${date.toLocaleDateString('en-US', { weekday: 'long' })}`;
  };

  // ui for the header of home 
  const getButtonStyle = (buttonType: string) => {
    switch (buttonType) {
      case 'today':
        return active === 'today' ? styles.activeButtonToday : styles.buttonToday;
      case 'calendar':
        return active === 'calendar' ? styles.activeButtonCalendar : styles.buttonCalendar;
      case 'add':
        return active === 'add' ? styles.activeButtonAdd : styles.addButton;
      default:
        return styles.buttonToday;
    }
  };

  const handleAddEvent = () => {
    setModalVisible(true);
  };

  const resetFields = () => {
    setTitle('');
    setDescription('');
    setYear('');
    setMonth('');
    setDay('');
    setHour('');
    setMinute('');
    setEndYear('');
    setEndMonth('');
    setEndDay('');
    setEndHour('');
    setEndMinute('');
    setError('');
  };

  const handleAddButton = () => {

    // error handle in case thay have not log in 
    const user = auth().currentUser;
    if (!user) {
      setError("No user logged in. Please log in first.");
      return;
    }

    const userEmail = user.email ? user.email.toLowerCase() : null;
    if (!userEmail) {
      setError("Unable to determine user's email.");
      return;

    }

    const startDateString = `${year}-${month}-${day} ${hour}:${minute}`;
    const endDateString = `${endYear}-${endMonth}-${endDay} ${endHour}:${endMinute}`;

    // add data 
    const userEventsRef = firestore()
      .collection('users')
      .doc(userEmail)
      .collection('events');

    userEventsRef.add({
      title: title,
      description: description,
      startDate: startDateString,
      endDate: endDateString,
      createdAt: firestore.FieldValue.serverTimestamp(),
    })
    .then(() => {
      resetFields();
      setModalVisible(false);
      loadEvents(); 
    })
    .catch(err => {
      setError(err.message);
    });

  };


  // loading events regarding to each user and email in database 
  const loadEvents = () => {
    const user = auth().currentUser;
    if (!user || !user.email) {
      return;
    }

    const userEmail = user.email.toLowerCase();
    firestore()
      .collection('users')
      .doc(userEmail)
      .collection('events')
      .orderBy('startDate', 'asc')
      .get()

      .then(querySnapshot => {
        const eventsList: any[] = [];
        querySnapshot.forEach(doc => {
          eventsList.push({ id: doc.id, ...doc.data() });
        });
        setAllEvents(eventsList.sort());

      })

      .catch(err => {
        console.error('Error fetching events: ', err);
      });
  };


  useEffect(() => {
    loadEvents();
  }, [active]);


  const yearStr = currentDate.getFullYear();
  const monthStr = String(currentDate.getMonth() + 1).padStart(2, '0');
  const dayStr = String(currentDate.getDate()).padStart(2, '0');
  const todayString = `${yearStr}-${monthStr}-${dayStr}`;

  const events = active === 'today'
    ? allEvents.filter(event => event.startDate?.slice(0,10) === todayString)
    : allEvents;


  const handleEventPress = (item: any) => {
    setSelectedEvent(item);
    setOptionModalVisible(true);
  };


// remove events 
  const handleRemoveEvent = () => {
    if (!selectedEvent) return;
    const user = auth().currentUser;
    if (!user || !user.email) return;

    const userEmail = user.email.toLowerCase();
    firestore()
      .collection('users')
      .doc(userEmail)
      .collection('events')
      .doc(selectedEvent.id)
      .delete()
      .then(() => {
        console.log('Event removed successfully!');
        setOptionModalVisible(false);
        setSelectedEvent(null);
        loadEvents();
      })
      .catch(err => {
        console.error('Error removing event:', err);
      });
  };

 // edit event 
  const handleEditEvent = () => {

    if (!selectedEvent) return;

    const { startDate, endDate, title, description } = selectedEvent;
    const [startD, startT] = startDate.split(' ');
    const [sYear, sMonth, sDay] = startD.split('-');
    const [sHour, sMinute] = startT.split(':');

    const [endD, endT] = endDate.split(' ');
    const [eYear, eMonth, eDay] = endD.split('-');
    const [eHour, eMinute] = endT.split(':');

    setTitle(title);
    setDescription(description);
    setYear(sYear);
    setMonth(sMonth);
    setDay(sDay);
    setHour(sHour);
    setMinute(sMinute);
    setEndYear(eYear);
    setEndMonth(eMonth);
    setEndDay(eDay);
    setEndHour(eHour);
    setEndMinute(eMinute);

    setOptionModalVisible(false);
    setEditModalVisible(true);

  };

  // check and edit for the event card 
  const handleSaveEdit = () => {
    if (!selectedEvent) return;
    const user = auth().currentUser;

    if (!user || !user.email) {
      setError("No user logged in. Please log in first.");
      return;

    }

    const userEmail = user.email.toLowerCase();
    const startDateString = `${year}-${month}-${day} ${hour}:${minute}`;
    const endDateString = `${endYear}-${endMonth}-${endDay} ${endHour}:${endMinute}`;

    firestore()

      .collection('users')
      .doc(userEmail)
      .collection('events')
      .doc(selectedEvent.id)
      .update({
        title: title,
        description: description,
        startDate: startDateString,
        endDate: endDateString,
      })

      .then(() => {
        console.log('Event updated successfully!');
        resetFields();
        setEditModalVisible(false);
        setSelectedEvent(null);
        loadEvents();
      })
      .catch(err => {
        console.error('Error updating event:', err);
        setError(err.message);
      });
  };

  const renderEventItem = ({ item }) => {
    const { title, description, startDate, endDate } = item;
    const [startD, startT] = startDate.split(' ');
    const [endD, endT] = endDate.split(' ');

    // ui insertion if today is selected  and the event card style
    if (active === 'today') {
      return (
        <TouchableOpacity onPress={() => handleEventPress(item)}>

          <View style={styles.eventItem}>

            <Text style={styles.eventTitle}>{title}</Text>
            <Text>--------------------------------------------------</Text>
            <Text style={styles.eventDescription}>Des: {description}</Text>
            <Text style={styles.eventDate}>Start at: {startT}</Text>
            <Text style={styles.eventDate}>End at: {endT}</Text>

          </View>

        </TouchableOpacity>
      );

    } 
    
    else {

      return (

        // calnder iserion ui for event card 

        <TouchableOpacity onPress={() => handleEventPress(item)}>

          <View style={styles.calendarEventItem}>

            <Text style={styles.calendarEventDateHeader}>{startD}</Text>
            <Text>--------------------------------------------------</Text>
            <Text style={styles.calendarEventTitle}>Title: {title}</Text>
            <Text style={styles.calendarEventDescription}>Description: {description}</Text>
            <Text style={styles.calendarEventTimes}>
              Start: {startT} | End: {endT}
            </Text>

          </View>

        </TouchableOpacity>
      );
    }
  };

  const listHeader = (

    // top home Ui
    <View>
      
      <Text style={styles.welcome}>Remove Events or Add</Text>
      <View style={styles.buttons}>

        <TouchableOpacity style={getButtonStyle('today')} onPress={() => setActive('today')}>
          <Text style={styles.buttonText}>Today</Text>
        </TouchableOpacity>

        <TouchableOpacity style={getButtonStyle('calendar')} onPress={() => setActive('calendar')}>
          <Text style={styles.buttonTextCalendar}>Calendar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={getButtonStyle('add')} onPress={handleAddEvent}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>

      </View>
      
      <Text style={styles.infoText}>
        {active === 'today' ? "Your Day's Schedule" : active === 'calendar' ? "View Calendar" : "Add New Event"}
      </Text>
      <Text style={styles.dateText}>{formatDate(currentDate)}</Text>

    </View>
  );

  // slide for the adding event  and the Ui 
  return (
    <SafeAreaView style={styles.main}>

      <View style={styles.content}>

        <FlatList
          data={events}
          keyExtractor={(item) => item.id}
          style={styles.eventsList}
          contentContainerStyle={styles.flatListContent} 
          ListHeaderComponent={listHeader}
          ListEmptyComponent={<Text style={styles.noEventsText}>No events found.</Text>}
          renderItem={renderEventItem}
        />

      </View>

      
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >

        <View style={styles.modalView}>

          <Text style={styles.modalTitle}>Add an Event</Text>
          <Text style={styles.inputLabel}>Title</Text>
          <TextInput style={styles.input} placeholder="Title" onChangeText={setTitle} value={title} />

          <Text style={styles.inputLabel}>Description</Text>
          <TextInput style={styles.input} placeholder="Description" onChangeText={setDescription} value={description} multiline />

          <Text style={styles.inputLabel}>Date</Text>
          
          <View style={styles.dateRow}>

            <View style={styles.dateBox}>

              <Text style={styles.smallLabel}>Year</Text>
              <TextInput style={styles.smallInput} placeholder="YYYY" onChangeText={setYear} value={year} keyboardType="numeric" maxLength={4} />

            </View>

            <View style={styles.dateBox}>

              <Text style={styles.smallLabel}>Month</Text>
              <TextInput style={styles.smallInput} placeholder="MM" onChangeText={setMonth} value={month} keyboardType="numeric" maxLength={2} />

            </View>


            {/* End Date */}
            <View style={styles.dateBox}>

              <Text style={styles.smallLabel}>Day</Text>
              <TextInput style={styles.smallInput} placeholder="DD" onChangeText={setDay} value={day} keyboardType="numeric" maxLength={2} />

            </View>

            <View style={styles.timeBox}>

              <Text style={styles.smallLabel}>Time</Text>

              <View style={styles.timeRow}>

                <TextInput style={styles.timeInput} placeholder="H" onChangeText={setHour} value={hour} keyboardType="numeric" maxLength={2} />
                <Text style={styles.colon}>:</Text>
                <TextInput style={styles.timeInput} placeholder="M" onChangeText={setMinute} value={minute} keyboardType="numeric" maxLength={2} />

              </View>

            </View>

          </View>

          <Text style={styles.inputLabel}>End Date</Text>

          {/* End Date */}
          <View style={styles.dateRow}>

            <View style={styles.dateBox}>

              <Text style={styles.smallLabel}>Year</Text>
              <TextInput style={styles.smallInput} placeholder="YYYY" onChangeText={setEndYear} value={endYear} keyboardType="numeric" maxLength={4} />

            </View>

            <View style={styles.dateBox}>

              <Text style={styles.smallLabel}>Month</Text>
              <TextInput style={styles.smallInput} placeholder="MM" onChangeText={setEndMonth} value={endMonth} keyboardType="numeric" maxLength={2} />

            </View>

            <View style={styles.dateBox}>

              <Text style={styles.smallLabel}>Day</Text>
              <TextInput style={styles.smallInput} placeholder="DD" onChangeText={setEndDay} value={endDay} keyboardType="numeric" maxLength={2} />

            </View>

            <View style={styles.timeBox}>

              <Text style={styles.smallLabel}>Time</Text>

              <View style={styles.timeRow}>

                <TextInput style={styles.timeInput} placeholder="H" onChangeText={setEndHour} value={endHour} keyboardType="numeric" maxLength={2} />
                <Text style={styles.colon}>:</Text>
                <TextInput style={styles.timeInput} placeholder="M" onChangeText={setEndMinute} value={endMinute} keyboardType="numeric" maxLength={2} />

              </View>

            </View>

          </View>

          {error !== '' && <Text style={styles.errorText}>{error}</Text>}

          <View style={styles.buttonRow}>

            <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={handleAddButton}>

              <Text style={styles.buttonText}>Add</Text>

            </TouchableOpacity>

            <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>

          </View>


        </View>
      </Modal>

      {/* Edit Event */}

      <Modal
        animationType="slide"
        transparent={true}
        visible={editModalVisible}
        onRequestClose={() => setEditModalVisible(false)}
      >

        <View style={styles.modalView}>

          <Text style={styles.modalTitle}>Edit Event</Text>
          <Text style={styles.inputLabel}>Title</Text>
          <TextInput style={styles.input} placeholder="Title" onChangeText={setTitle} value={title} />

          <Text style={styles.inputLabel}>Description</Text>
          <TextInput style={styles.input} placeholder="Description" onChangeText={setDescription} value={description} multiline />

          <Text style={styles.inputLabel}>Date</Text>

          {/* Start Date */}
          <View style={styles.dateRow}>

            <View style={styles.dateBox}>

              <Text style={styles.smallLabel}>Year</Text>
              <TextInput style={styles.smallInput} placeholder="YYYY" onChangeText={setYear} value={year} keyboardType="numeric" maxLength={4} />

            </View>

            <View style={styles.dateBox}>

              <Text style={styles.smallLabel}>Month</Text>
              <TextInput style={styles.smallInput} placeholder="MM" onChangeText={setMonth} value={month} keyboardType="numeric" maxLength={2} />

            </View>

            <View style={styles.dateBox}>

              <Text style={styles.smallLabel}>Day</Text>
              <TextInput style={styles.smallInput} placeholder="DD" onChangeText={setDay} value={day} keyboardType="numeric" maxLength={2} />

            </View>

            <View style={styles.timeBox}>

              <Text style={styles.smallLabel}>Time</Text>

              <View style={styles.timeRow}>
                <TextInput style={styles.timeInput} placeholder="H" onChangeText={setHour} value={hour} keyboardType="numeric" maxLength={2} />
                <Text style={styles.colon}>:</Text>
                <TextInput style={styles.timeInput} placeholder="M" onChangeText={setMinute} value={minute} keyboardType="numeric" maxLength={2} />
              </View>

            </View>

          </View>

          <Text style={styles.inputLabel}>End Date</Text>

          {/* End Date */}
          <View style={styles.dateRow}>

            <View style={styles.dateBox}>
              
              <Text style={styles.smallLabel}>Year</Text>
              <TextInput style={styles.smallInput} placeholder="YYYY" onChangeText={setEndYear} value={endYear} keyboardType="numeric" maxLength={4} />

            </View>

            <View style={styles.dateBox}>

              <Text style={styles.smallLabel}>Month</Text>
              <TextInput style={styles.smallInput} placeholder="MM" onChangeText={setEndMonth} value={endMonth} keyboardType="numeric" maxLength={2} />

            </View>

            <View style={styles.dateBox}>

              <Text style={styles.smallLabel}>Day</Text>
              <TextInput style={styles.smallInput} placeholder="DD" onChangeText={setEndDay} value={endDay} keyboardType="numeric" maxLength={2} />

            </View>

            <View style={styles.timeBox}>

              <Text style={styles.smallLabel}>Time</Text>

              <View style={styles.timeRow}>

                <TextInput style={styles.timeInput} placeholder="H" onChangeText={setEndHour} value={endHour} keyboardType="numeric" maxLength={2} />
                <Text style={styles.colon}>:</Text>
                <TextInput style={styles.timeInput} placeholder="M" onChangeText={setEndMinute} value={endMinute} keyboardType="numeric" maxLength={2} />

              </View>

            </View>

          </View>

          {error !== '' && <Text style={styles.errorText}>{error}</Text>}

          <View style={styles.buttonRow}>

            <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={handleSaveEdit}>
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.modalButton} onPress={() => {setEditModalVisible(false); resetFields();}}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>

          </View>

        </View>

      </Modal>

      {/* Edit/Remove */}
      <Modal

        animationType="slide"
        transparent={true}
        visible={optionModalVisible}
        onRequestClose={() => setOptionModalVisible(false)}
      >

        <View style={styles.optionModalContainer}>

          <View style={styles.optionModalView}>

            <Text style={styles.optionModalTitle}>Select Option</Text>

            <View style={styles.optionButtonContainer}>

              <TouchableOpacity
                style={styles.editButton}
                onPress={() => {
                  setOptionModalVisible(false);
                  handleEditEvent();
                }}
              >

                <Text style={styles.buttonText}>Edit event</Text>

              </TouchableOpacity>

              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => {
                  setOptionModalVisible(false);
                  handleRemoveEvent();
                }}
              >

                <Text style={styles.buttonText}>Remove event</Text>

              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelOptionButton}
                onPress={() => setOptionModalVisible(false)}
              >

                <Text style={styles.buttonText}>Cancel</Text>

              </TouchableOpacity>

            </View>

          </View>

        </View>

      </Modal>

      <View style={styles.navView}>

        <NavBar path="home" user={route.params.user}/>

      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  main: {
    flex: 1,
    backgroundColor: '#FFFFFF', 
    flexDirection: 'row-reverse',
  },

  content: {
    flex: 1,
    paddingRight: 20,
    paddingTop: 20,
  },

  flatListContent: {
    backgroundColor: '#FFFFFF', 
    flexGrow: 1,
    paddingBottom: 20, 
    
  },

  welcome: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 10,
    marginLeft: 20,
  },

  buttons: {
    flexDirection: 'row',
    marginTop: 36,
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
  },

  buttonToday: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 19,
    paddingVertical: 10,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: '#333333',
    marginRight: 10,
  },

  activeButtonToday: {
    backgroundColor: '#C8AD7E',
    paddingHorizontal: 19,
    paddingVertical: 10,
    borderRadius: 19,
    marginRight: 10,
  },

  buttonCalendar: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 19,
    paddingVertical: 10,
    borderRadius: 19,
    marginRight: 30,
    borderWidth: 1,
    borderColor: '#333333',
  },

  activeButtonCalendar: {
    backgroundColor: '#C8AD7E',
    paddingHorizontal: 19,
    paddingVertical: 10,
    borderRadius: 19,
    marginRight: 30,
  },

  addButton: {
    backgroundColor: '#E3D8B7',
    paddingHorizontal: 19,
    paddingVertical: 10,
    borderRadius: 50,
  },

  activeButtonAdd: {
    backgroundColor: '#C8AD7E',
    paddingHorizontal: 19,
    paddingVertical: 10,
    borderRadius: 50,
  },

  buttonText: {
    fontSize: 19,
    color: '#333333',
    fontWeight: 'bold',
    textAlign: 'center',
  },

  buttonTextCalendar: {
    fontSize: 19,
    color: '#333333',
    fontWeight: 'bold',
  },

  addButtonText: {
    fontSize: 24,
    color: '#333333',
    fontWeight: 'bold',
  },

  infoText: {
    fontSize: 16,
    color: '#333333',
    marginTop: 10,
    marginLeft: 20,
  },

  dateText: {
    fontSize: 19,
    color: '#333333',
    marginTop: 10,
    marginLeft: 20,
    marginBottom: 15,
    fontWeight: 'bold',
  },

  navView: {
    paddingHorizontal: 35,
    flex: 0,
  },

  modalView: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginTop: 9,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

  input: {
    width: '100%',
    padding: 15,
    marginBottom: 17,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },

  inputLabel: {
    fontSize: 16,
    color: '#333333',
    fontWeight: 'bold',
    marginBottom: 5,
  },

  modalTitle: {
    marginBottom: 25,
    fontSize: 25,
    fontWeight: 'bold',
  },

  buttonRow: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 10,
    marginTop: 20,
  },

  modalButton: {
    backgroundColor: '#EDEDED',
    padding: 15,
    borderRadius: 5,
    width: '100%',
    marginBottom: 10,
  },

  cancelButton: {
    backgroundColor: '#C8AD7E',
  },    

  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '95%',
    marginBottom: 17,
  },

  dateBox: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    flex: 1,
    marginRight: 5,
  },

  smallLabel: {
    fontSize: 14,
    color: '#333333',
    fontWeight: 'bold',
    marginBottom: 5,
  },

  smallInput: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#fff',
  },

  timeBox: {
    flexDirection: 'column',
    flex: 1,
    marginLeft: 5,
  },

  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  timeInput: {
    width: '50%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#fff',
    textAlign: 'center',
  },

  colon: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 5,
  },

  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: 'bold',
  },

  eventsList: {
    width: '100%',
  },

  noEventsText: {
    textAlign: 'center',
    color: '#999',
    marginTop: 20,
    fontSize: 16,
  },

  eventItem: {
    backgroundColor: '#C8AD7E',
    padding: 15,
    marginHorizontal: 20,
    marginBottom: 10,
    borderRadius: 19,
  },

  eventTitle: {
    fontSize: 23,
    fontWeight: 'bold',
    color: '#000000',
  },

  eventDate: {
    fontSize: 19,
    color: '#000000',
    marginTop: 9,
  },

  eventDescription: {
    fontSize: 19,
    color: '#000000',
    marginTop: 5,
    fontWeight: '600',
  },

  
  calendarEventItem: {
    backgroundColor: '#EDEDED',
    padding: 15,
    marginHorizontal: 10,
    marginBottom: 10,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: '#B77800',
  },

  calendarEventDateHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 0,
  },

  calendarEventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginTop: 5,
  },

  calendarEventDescription: {
    fontSize: 16,
    color: '#333333',
    marginTop: 5,
  },

  calendarEventTimes: {
    fontSize: 16,
    color: '#333333',
    marginTop: 5,
    fontStyle: 'italic',
  },

 
  optionModalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)', 
    justifyContent: 'center',
    alignItems: 'center',
  },

  optionModalView: {
    backgroundColor: '#FFFFFF',
    width: '80%',
    borderRadius: 20,
    padding: 20,
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

  optionModalTitle: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },

  optionButtonContainer: {
    width: '100%',
  },

  editButton: {
    backgroundColor: '#C8AD7E',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
  },

  removeButton: {
    backgroundColor: '#E57373',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
  },

  cancelOptionButton: {
    backgroundColor: '#ccc',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
  },

});

export default Home;
