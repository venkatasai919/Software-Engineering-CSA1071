# hostel_management_system.py

class Student:
    def __init__(self, student_id, name):
        self.student_id = student_id
        self.name = name

class Room:
    def __init__(self, room_no, capacity):
        self.room_no = room_no
        self.capacity = capacity
        self.occupied = 0

class HostelManagementSystem:
    def __init__(self):
        self.students = []
        self.rooms = []

    def add_student(self, student):
        self.students.append(student)

    def add_room(self, room):
        self.rooms.append(room)

    def allocate_room(self, student):
        for room in self.rooms:
            if room.occupied < room.capacity:
                room.occupied += 1
                print(f"{student.name} allocated to Room {room.room_no}")
                return
        print("No rooms available")

    def display_rooms(self):
        print("\nRoom Status")
        for room in self.rooms:
            print(
                f"Room {room.room_no}: "
                f"{room.occupied}/{room.capacity} occupied"
            )

# Main Program
system = HostelManagementSystem()

system.add_room(Room("A101", 2))
system.add_room(Room("A102", 2))

s1 = Student(1, "Pradeep")
s2 = Student(2, "Hemanth")
s3 = Student(3, "Jeevan")

system.add_student(s1)
system.add_student(s2)
system.add_student(s3)

system.allocate_room(s1)
system.allocate_room(s2)
system.allocate_room(s3)

system.display_rooms()
