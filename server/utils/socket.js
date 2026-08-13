const { Server } = require("socket.io");

const initSocket = (server, app) => {
  const io = new Server(server, {
    cors: {
      origin: [
        "http://localhost:5173",
        "http://localhost:3000",
        "https://frontend-rappi.vercel.app" // Cambia por tu dominio exacto de Vercel si es diferente
      ],
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
      credentials: true,
    },
    // 🟢 Cambia esto para usar WebSocket directamente sin pasar por HTTP Polling
    transports: ["websocket"], 
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  app.set("io", io);

  io.on("connection", (socket) => {
    console.log(`⚡ Conectado ID: ${socket.id}`);

    socket.on("join_room", (roomName) => {
      if (roomName) {
        socket.join(roomName);
        console.log(`📌 Socket ${socket.id} unido a la sala: ${roomName}`);
      }
    });

    socket.on("leave_room", (roomName) => {
      if (roomName) {
        socket.leave(roomName);
        console.log(`🚪 Socket ${socket.id} salió de la sala: ${roomName}`);
      }
    });

    socket.on("driver_location_update", (data) => {
      if (data?.activeOrderId) {
        io.to(data.activeOrderId).emit("driver_location", data);
      } else {
        io.emit("driver_location", data);
      }
    });

    socket.on("update_status", (data) => {
      console.log("🔄 Estado actualizado por socket:", data);
      if (data?.orderId || data?._id) {
        const orderRoom = data.orderId || data._id;
        io.to(orderRoom).emit("order_updated", data);
      }
      io.emit("order_updated", data);
    });

    socket.on("update_order_details", (updatedOrder) => {
      console.log("📝 Pedido editado:", updatedOrder);
      if (updatedOrder?._id) {
        io.to(updatedOrder._id).emit("order_updated", updatedOrder);
      }
      io.emit("order_updated", updatedOrder);
    });

    socket.on("disconnect", (reason) => {
      console.log(`❌ Desconectado ID: ${socket.id} (Razón: ${reason})`);
    });
  });

  return io;
};

module.exports = initSocket;