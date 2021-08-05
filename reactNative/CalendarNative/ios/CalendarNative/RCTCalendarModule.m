#import "RCTCalendarModule.h"
#import <React/RCTLog.h>

@implementation RCTCalendarModule

// optional argument to specify name of module exported, getName counterpart
RCT_EXPORT_MODULE(CalendarModule);

// native method with callback
RCT_EXPORT_METHOD(createCalendarEvent:(NSString *)name location:(NSString *)location callback:(RCTResponseSenderBlock)callback ){
    NSInteger eventId=1;
    callback(@[[NSNull,null],eventId]);
    RCTLogInfo(@"Creating Event %@ at %@",name,location);
}


//native method with promise
RCT_EXPORT_METHOD(createCalenderEventPromise:(NSString *)name location:(NSString *)location resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject){    
    NSInteger eventId=1;
    RCTLogInfo(@"Creating Event %@ at %@",name,location);
    if(eventId){
        resolve(@[@(eventId)])
    }else{
        reject(@"event_failure",@"no event id returned",nil)
    }
}


// exporting constants
- (NSDictionary *)constantsToExport
{
 return @{ @"Birthday": @"Nov 11, 2000" };
}

@end