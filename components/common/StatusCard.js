import { View, StyleSheet } from 'react-native';
import { CalendarClock, ClipboardCheck, X } from 'lucide-react-native';


export default function StatusCard({ status }) {
  const statusStyles = {
    Pending: { 
      backgroundColor: '#FFF2D6', 
      icon: <CalendarClock size={15} color="#946200" />,
      boxShadow: '#FFEA88 0px 0px 0px 3px' 
    },
    Accepted: { 
      backgroundColor: '#E5F4E0', 
      icon: <ClipboardCheck size={15} color="#34733B" />,
      boxShadow: '#E1E9C9 0px 0px 0px 3px'
    },
    Declined: { 
      backgroundColor: '#efc1ba', 
      icon: <X size={15} color="#0c0100" />,
      boxShadow: '#f5d6d1 0px 0px 0px 3px'
    },
    Completed: {
      backgroundColor: '#E4EEFF',
      icon: <ClipboardCheck size={15} color="#315A9B" />,
      boxShadow: '#D5E2F8 0px 0px 0px 3px'
    },
  };
  const colors = statusStyles[status] || statusStyles.Pending;

  return (
    <View style={[styles.badge, { backgroundColor: colors.backgroundColor, boxShadow: colors.boxShadow }]}>
      {colors.icon}
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    minWidth: 15,
    minHeight: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    paddingHorizontal: 5,
    paddingVertical: 5,
    
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
  },
});
