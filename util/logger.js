const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, prettyPrint } = format;
const logger = createLogger({
    level: 'info',
    format: combine(
      label({ label: 'right now!' }),
      timestamp(),
      prettyPrint()
    ),
    defaultMeta: { service: 'user-service' },
    transports: [
      new transports.File({ filename: './log/error.log' }),
    ],
  });
  
  
    logger.add(new transports.Console({
      format: format.timestamp(),
    }));

    module.exports=logger;