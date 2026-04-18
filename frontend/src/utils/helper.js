export const validEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export const validPassword= (password)=>{
    const strongPasswordRegex =/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return strongPasswordRegex.test(password);
}

export const getInitials = (name) => {
  if (!name) return "";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + " "+ parts[1][0]).toUpperCase();
};

export const getRandomColor = (name) => {
  if (!name) return "#888";
  const colors = ["#F59E0B", "#10B981", "#3B82F6", "#8B5CF6", "#EF4444", "#14B8A6", "#D946EF"];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
};

export const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

export const toDateTimeInputValue = (isoString) => {
  if (!isoString) return "";

  const date = new Date(isoString);
  const offset = date.getTimezoneOffset() * 60000;
  const localISO = new Date(date - offset).toISOString();

  return localISO.slice(0, 16);
};

export const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date();
  };

export const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

export const getStatusColor = (status) => {
    switch(status) {
      case 'Completed': return 'bg-green-100 text-green-700 border-green-200';
      case 'In Progress': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Pending': return 'bg-orange-100 text-orange-700 border-orange-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

 