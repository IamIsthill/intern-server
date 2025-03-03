.PHONY: db
db:	
	mongod --dbpath ~/data/db --logpath ~/data/log/mongodb/mongo.log --fork

.PHONY: p
p:
	ps aux | grep -v grep | grep mongod

.PHONY: stopdb
stopdb:
	@PID=$$(ps aux | grep -v grep | grep mongod | awk '{print $$2}'); \
	kill $$PID; \
	echo 'MongoDB stopped'