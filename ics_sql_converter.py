import pandas as pd
import numpy as np
import icalendar
from icalendar import Calendar
import pyodbc
from dotenv import load_dotenv
import os
from sqlalchemy import create_engine, URL, text, MetaData, Table, select
# from sqlalchemy.engine.url import URL

# upload calendar as an ics file to block out availability
path_to_ics_file = "/Users/ijeomaehigiator/Desktop/availability.ics"
with open(path_to_ics_file) as f:

    calendar = Calendar.from_ical(f.read())

bookings = pd.DataFrame(columns = ['start_date', 'end_date', 'title'])   
for booking in calendar.walk('vevent'):
    event = pd.DataFrame(columns = ['start_date', 'end_date', 'availability'])
    event.start_date = [pd.to_datetime(booking.decoded('dtstart'))]
    event.end_date = [pd.to_datetime(booking.decoded('dtend'))]
    event.availability = [0]
    bookings = pd.concat([bookings, event], ignore_index=True)
bookings
# create available slots
hour_start = 9
hour_end = 22
today = pd.Timestamp('today')
# year_start = pd.Timestamp('today').floor('d').year
month_today = pd.Timestamp('today').floor('d').month

day_start = pd.Timestamp('today') + np.timedelta64(1, 'M')
day_start = day_start.replace(day=1, hour=hour_start)
day_end = day_start + np.timedelta64(3, 'M')
day_end = day_end.replace(hour=hour_end)


session_begins = pd.period_range(start=day_start, end=day_end, freq='1H').to_timestamp()
session_begins = session_begins[(session_begins.hour >= hour_start) & (session_begins.hour < hour_end)]
session_ends = session_begins + np.timedelta64(1, 'h')
timeslots = pd.DataFrame({'start_time':session_begins, 'end_time':session_ends})

timeslots = timeslots[~timeslots.start_time.isin(bookings.start_date)]
timeslots = timeslots[~timeslots.end_time.isin(bookings.end_date)]
timeslots['available'] = 1

# print(time_slots)
load_dotenv()
password = os.getenv("PASSWORD")
username = os.getenv("USERNAME")
# Create a connection string
connection_str = (
    r'DRIVER={MySQL ODBC 8.1 ANSI Driver};'
    r'SERVER=localhost;'
    r'DATABASE=namzfit;'
    f'UID={username};'
    f'PWD={password};'
)
# engine_str = f'mysql+pyodbc://{username}:{password}@localhost:3306/namzfit'

url_object = URL.create(
    "mysql+pyodbc",
    username=username,
    password=password,  # plain (unescaped) text
    host="localhost",
    port=3306,
    database="namzfit",
    query=dict(driver='MySQL ODBC 8.1 ANSI Driver', MULTI_HOST=1),
)
# Establish a connection
# connection = pyodbc.connect(connection_str)
engine = create_engine(url_object)
metadata = MetaData()

db_timeslots = Table('timeslots', metadata, autoload=True, autoload_with=engine)
# timeslots.to_sql('timeslots', engine, if_exists='append', index=False)
# edit below to use SQLAlchemy.
# pd.read_sql_query('''select * from bookings''', connection) 