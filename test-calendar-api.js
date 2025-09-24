// Test Google Calendar API Key
const API_KEY = 'YOUR_API_KEY_HERE'; // Replace with your actual API key

async function testCalendarAPI() {
  try {
    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary?key=${API_KEY}`
    );
    
    if (response.ok) {
      console.log('✅ Google Calendar API Key is working!');
      const data = await response.json();
      console.log('Calendar ID:', data.id);
    } else {
      console.log('❌ API Key test failed:', response.status, response.statusText);
    }
  } catch (error) {
    console.log('❌ Error testing API key:', error.message);
  }
}

testCalendarAPI();
