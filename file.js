import React, { useState, useEffect } from 'react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Clock, Users, Bed, AlertTriangle, TrendingUp, Activity, UserPlus, Settings } from 'lucide-react';

const HospitalDashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState('overview');
  const [simulationData, setSimulationData] = useState({
    totalPatients: 12,
    averageWaitTime: 18.5,
    activeStaff: 4,
    occupancyRate: 65
  });
  const [notifications, setNotifications] = useState([]);
  const [emergencyMode, setEmergencyMode] = useState(false);

  // Static but realistic data that updates
  const [waitingTrendData] = useState([
    { time: '09:00', waitTime: 15.2, patients: 8 },
    { time: '09:15', waitTime: 18.7, patients: 10 },
    { time: '09:30', waitTime: 22.1, patients: 12 },
    { time: '09:45', waitTime: 19.8, patients: 11 },
    { time: '10:00', waitTime: 16.4, patients: 9 },
    { time: '10:15', waitTime: 20.3, patients: 13 },
    { time: '10:30', waitTime: 18.5, patients: 12 }
  ]);

  const [arrivalData] = useState([
    { time: '09:00', arrivals: 3 },
    { time: '09:15', arrivals: 5 },
    { time: '09:30', arrivals: 4 },
    { time: '09:45', arrivals: 2 },
    { time: '10:00', arrivals: 6 },
    { time: '10:15', arrivals: 4 },
    { time: '10:30', arrivals: 3 }
  ]);

  const [predictions] = useState([
    { time: '10:35', predictedWait: 19.2, confidence: 87 },
    { time: '10:40', predictedWait: 21.5, confidence: 85 },
    { time: '10:45', predictedWait: 18.8, confidence: 89 },
    { time: '10:50', predictedWait: 16.3, confidence: 92 },
    { time: '10:55', predictedWait: 22.7, confidence: 84 },
    { time: '11:00', predictedWait: 20.1, confidence: 88 }
  ]);

  const [staff, setStaff] = useState([
    { id: 1, name: 'Dr. Smith', type: 'Doctor', room: 'Room 1', status: 'Busy', utilization: 85 },
    { id: 2, name: 'Dr. Johnson', type: 'Doctor', room: 'Room 2', status: 'Available', utilization: 45 },
    { id: 3, name: 'Nurse Adams', type: 'Nurse', room: 'Room 3', status: 'Busy', utilization: 92 },
    { id: 4, name: 'Dr. Wilson', type: 'Doctor', room: 'Room 4', status: 'Break', utilization: 67 },
    { id: 5, name: 'Nurse Davis', type: 'Nurse', room: 'Room 5', status: 'Available', utilization: 38 }
  ]);

  const [rooms, setRooms] = useState([
    { id: 1, name: 'Room 1', status: 'occupied' },
    { id: 2, name: 'Room 2', status: 'occupied' },
    { id: 3, name: 'Room 3', status: 'occupied' },
    { id: 4, name: 'Room 4', status: 'maintenance' },
    { id: 5, name: 'Room 5', status: 'available' },
    { id: 6, name: 'Room 6', status: 'closed' },
    { id: 7, name: 'Room 7', status: 'closed' }
  ]);

  const [patients] = useState([
    { id: 'P001', priority: 'Emergency', serviceType: 'Consultation', waitTime: 5.2, status: 'Waiting' },
    { id: 'P002', priority: 'Urgent', serviceType: 'Lab Work', waitTime: 12.8, status: 'Waiting' },
    { id: 'P003', priority: 'Routine', serviceType: 'Procedure', waitTime: 25.1, status: 'Waiting' },
    { id: 'P004', priority: 'Emergency', serviceType: 'Discharge', waitTime: 3.7, status: 'Waiting' },
    { id: 'P005', priority: 'Urgent', serviceType: 'Consultation', waitTime: 18.4, status: 'Waiting' },
    { id: 'P006', priority: 'Routine', serviceType: 'Lab Work', waitTime: 31.2, status: 'Waiting' },
    { id: 'P007', priority: 'Emergency', serviceType: 'Procedure', waitTime: 8.9, status: 'Waiting' },
    { id: 'P008', priority: 'Routine', serviceType: 'Consultation', waitTime: 22.6, status: 'Waiting' }
  ]);

  const [recommendations] = useState([
    {
      type: 'urgent',
      title: 'High Wait Times Detected',
      description: 'Average wait time is 18.5 minutes. Consider opening Room 6.',
      impact: 'Could reduce wait time by 8-12 minutes'
    },
    {
      type: 'warning',
      title: 'Staff Overutilization',
      description: 'Nurse Adams at 92% utilization. Consider reallocation.',
      impact: 'Prevent staff burnout and improve patient flow'
    },
    {
      type: 'critical',
      title: 'Emergency Queue Buildup',
      description: '3 emergency patients waiting. Deploy rapid response team.',
      impact: 'Critical for patient safety'
    }
  ]);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      
      // Simulate slight changes in metrics
      setSimulationData(prev => ({
        totalPatients: Math.max(8, Math.min(20, prev.totalPatients + (Math.random() - 0.5) * 2)),
        averageWaitTime: Math.max(5, Math.min(35, prev.averageWaitTime + (Math.random() - 0.5) * 3)),
        activeStaff: Math.max(3, Math.min(7, Math.round(prev.activeStaff + (Math.random() - 0.5) * 0.3))),
        occupancyRate: Math.max(30, Math.min(90, prev.occupancyRate + (Math.random() - 0.5) * 8))
      }));
    }, 2000);

    return () => clearInterval(timer);
  }, []);

  // Action handlers
  const addNotification = (message, type = 'info') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };

  const handleAddStaff = () => {
    const staffNames = ['Dr. Martinez', 'Nurse Brown', 'Dr. Garcia', 'Nurse Wilson', 'Dr. Lee'];
    const roomNumbers = [6, 7, 8, 9, 10];
    const availableRoom = roomNumbers[Math.floor(Math.random() * roomNumbers.length)];
    const staffName = staffNames[Math.floor(Math.random() * staffNames.length)];
    
    const newStaff = {
      id: staff.length + 1,
      name: staffName,
      type: staffName.includes('Dr.') ? 'Doctor' : 'Nurse',
      room: `Room ${availableRoom}`,
      status: 'Available',
      utilization: 0
    };
    
    setStaff(prev => [...prev, newStaff]);
    setSimulationData(prev => ({
      ...prev,
      activeStaff: prev.activeStaff + 1,
      averageWaitTime: Math.max(5, prev.averageWaitTime - 5)
    }));
    addNotification(`${staffName} has been added and assigned to Room ${availableRoom}`, 'success');
  };

  const handleOpenRoom = () => {
    const closedRoom = rooms.find(room => room.status === 'closed');
    if (closedRoom) {
      setRooms(prev => prev.map(room => 
        room.id === closedRoom.id ? { ...room, status: 'available' } : room
      ));
      setSimulationData(prev => ({
        ...prev,
        occupancyRate: Math.max(30, prev.occupancyRate - 10),
        averageWaitTime: Math.max(5, prev.averageWaitTime - 3)
      }));
      addNotification(`${closedRoom.name} has been opened and is now available`, 'success');
    } else {
      addNotification('No closed rooms available to open', 'warning');
    }
  };

  const handleReallocate = () => {
    // Find overutilized staff
    const overutilizedStaff = staff.filter(s => s.utilization > 80);
    const underutilizedStaff = staff.filter(s => s.utilization < 60 && s.status === 'Available');
    
    if (overutilizedStaff.length > 0 && underutilizedStaff.length > 0) {
      const targetStaff = overutilizedStaff[0];
      const helperStaff = underutilizedStaff[0];
      
      setStaff(prev => prev.map(s => {
        if (s.id === targetStaff.id) {
          return { ...s, utilization: Math.max(50, s.utilization - 20) };
        }
        if (s.id === helperStaff.id) {
          return { ...s, status: 'Busy', utilization: Math.min(80, s.utilization + 20) };
        }
        return s;
      }));
      
      addNotification(`Reallocated workload from ${targetStaff.name} to ${helperStaff.name}`, 'success');
    } else {
      addNotification('No suitable staff reallocation available at this time', 'warning');
    }
  };

  const handleEmergencyMode = () => {
    setEmergencyMode(prev => !prev);
    if (!emergencyMode) {
      // Activate emergency protocols
      setSimulationData(prev => ({
        ...prev,
        activeStaff: Math.min(7, prev.activeStaff + 2),
        averageWaitTime: Math.max(5, prev.averageWaitTime - 8)
      }));
      
      setStaff(prev => prev.map(s => ({
        ...s,
        status: s.status === 'Break' ? 'Available' : s.status,
        utilization: s.status === 'Break' ? 75 : s.utilization
      })));
      
      addNotification('Emergency mode activated - All available staff deployed', 'critical');
    } else {
      addNotification('Emergency mode deactivated - Normal operations resumed', 'info');
    }
  };

  const priorityColors = {
    'Emergency': '#ef4444',
    'Urgent': '#f97316',
    'Routine': '#22c55e'
  };

  const statusData = [
    { name: 'Busy', value: staff.filter(s => s.status === 'Busy').length, color: '#ef4444' },
    { name: 'Available', value: staff.filter(s => s.status === 'Available').length, color: '#22c55e' },
    { name: 'Break', value: staff.filter(s => s.status === 'Break').length, color: '#f59e0b' }
  ];

  const MetricCard = ({ title, value, icon: Icon, color, subtitle }) => (
    <div className="bg-white rounded-lg shadow-md p-6 border-l-4" style={{ borderLeftColor: color }}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <Icon className="h-8 w-8" style={{ color }} />
      </div>
    </div>
  );

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Patients Waiting"
          value={Math.round(simulationData.totalPatients)}
          icon={Users}
          color="#3b82f6"
          subtitle="Currently in queue"
        />
        <MetricCard
          title="Average Wait Time"
          value={`${simulationData.averageWaitTime.toFixed(1)} min`}
          icon={Clock}
          color={simulationData.averageWaitTime > 20 ? "#ef4444" : "#22c55e"}
          subtitle="Real-time average"
        />
        <MetricCard
          title="Active Staff"
          value={`${simulationData.activeStaff}/7`}
          icon={Activity}
          color="#8b5cf6"
          subtitle="Currently on duty"
        />
        <MetricCard
          title="Occupancy Rate"
          value={`${Math.round(simulationData.occupancyRate)}%`}
          icon={Bed}
          color="#f59e0b"
          subtitle="Bed utilization"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Wait Time Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={waitingTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="waitTime" stroke="#3b82f6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Patient Arrivals</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={arrivalData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="arrivals" stroke="#22c55e" fill="#22c55e" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Patient Queue */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Patient Queue</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Wait Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {patients.map((patient) => (
                <tr key={patient.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {patient.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span 
                      className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full text-white"
                      style={{ backgroundColor: priorityColors[patient.priority] }}
                    >
                      {patient.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {patient.serviceType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {patient.waitTime.toFixed(1)} min
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {patient.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderPredictions = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">30-Minute Wait Time Predictions</h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={predictions}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip 
              formatter={(value, name) => [
                `${value.toFixed(1)} minutes`, 
                name === 'predictedWait' ? 'Predicted Wait' : name
              ]}
            />
            <Line 
              type="monotone" 
              dataKey="predictedWait" 
              stroke="#f59e0b" 
              strokeWidth={3}
              dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Prediction Model Stats</h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Model Accuracy</span>
              <span className="font-semibold">87.3%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Confidence Interval</span>
              <span className="font-semibold">±3.2 minutes</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Last Updated</span>
              <span className="font-semibold">{currentTime.toLocaleTimeString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Prediction Method</span>
              <span className="font-semibold">M/M/c + ML</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Queue Theory Parameters</h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Arrival Rate (λ)</span>
              <span className="font-semibold">2.3 patients/hour</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Service Rate (μ)</span>
              <span className="font-semibold">0.8 patients/hour</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Servers (c)</span>
              <span className="font-semibold">{simulationData.activeStaff} staff</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Utilization (ρ)</span>
              <span className="font-semibold">73.2%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderResources = () => (
    <div className="space-y-6">
      {/* Staff Cards */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Staff & Room Utilization</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {staff.map((member) => (
            <div key={member.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-semibold text-gray-900">{member.name}</h4>
                  <p className="text-sm text-gray-600">{member.type} • {member.room}</p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  member.status === 'Busy' ? 'bg-red-100 text-red-800' :
                  member.status === 'Available' ? 'bg-green-100 text-green-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {member.status}
                </span>
              </div>
              
              <div className="mb-2">
                <div className="flex justify-between text-sm mb-1">
                  <span>Utilization</span>
                  <span>{member.utilization}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      member.utilization > 85 ? 'bg-red-500' :
                      member.utilization > 70 ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`}
                    style={{ width: `${member.utilization}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Utilization Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={staff}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="utilization" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Staff Status Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  const renderRecommendations = () => (
    <div className="space-y-6">
      {/* Notifications */}
      {notifications.length > 0 && (
        <div className="space-y-2">
          {notifications.map((notification) => (
            <div key={notification.id} className={`p-4 rounded-lg border-l-4 ${
              notification.type === 'success' ? 'border-green-500 bg-green-50' :
              notification.type === 'warning' ? 'border-yellow-500 bg-yellow-50' :
              notification.type === 'critical' ? 'border-red-500 bg-red-50' :
              'border-blue-500 bg-blue-50'
            }`}>
              <p className={`text-sm ${
                notification.type === 'success' ? 'text-green-800' :
                notification.type === 'warning' ? 'text-yellow-800' :
                notification.type === 'critical' ? 'text-red-800' :
                'text-blue-800'
              }`}>
                {notification.message}
              </p>
            </div>
          ))}
        </div>
      )}

      {emergencyMode && (
        <div className="bg-red-100 border-l-4 border-red-500 p-4 rounded-lg">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
            <p className="text-red-800 font-semibold">Emergency Mode Active - All protocols engaged</p>
          </div>
        </div>
      )}

      <div className="grid gap-4">
        {recommendations.map((rec, index) => (
          <div key={index} className={`border-l-4 p-4 rounded-lg ${
            rec.type === 'critical' ? 'border-red-500 bg-red-50' :
            rec.type === 'urgent' ? 'border-orange-500 bg-orange-50' :
            'border-yellow-500 bg-yellow-50'
          }`}>
            <div className="flex items-start">
              <AlertTriangle className={`h-5 w-5 mt-0.5 mr-3 ${
                rec.type === 'critical' ? 'text-red-500' :
                rec.type === 'urgent' ? 'text-orange-500' :
                'text-yellow-500'
              }`} />
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">{rec.title}</h4>
                <p className="text-gray-700 mt-1">{rec.description}</p>
                <p className="text-sm text-gray-600 mt-2 font-medium">Expected Impact: {rec.impact}</p>
              </div>
              <button 
                onClick={() => {
                  if (rec.title.includes('Room')) handleOpenRoom();
                  else if (rec.title.includes('Staff')) handleReallocate();
                  else if (rec.title.includes('Emergency')) handleEmergencyMode();
                }}
                className="ml-4 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
              >
                Implement
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button 
            onClick={handleAddStaff}
            className="flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <UserPlus className="h-5 w-5 mr-2" />
            Add Staff
          </button>
          <button 
            onClick={handleOpenRoom}
            className="flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Bed className="h-5 w-5 mr-2" />
            Open Room
          </button>
          <button 
            onClick={handleReallocate}
            className="flex items-center justify-center px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            <Settings className="h-5 w-5 mr-2" />
            Reallocate
          </button>
          <button 
            onClick={handleEmergencyMode}
            className={`flex items-center justify-center px-4 py-3 text-white rounded-lg transition-colors ${
              emergencyMode 
                ? 'bg-red-600 hover:bg-red-
