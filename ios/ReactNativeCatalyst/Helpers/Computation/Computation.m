//
//  Computation.m
//  ReactNativeCatalyst
//
//  Created by Daniel Wiese on 3/29/2020.
//

#import <Foundation/Foundation.h>
#import "Computation.h"
#import <Sample/Sample.h>

@implementation Computation

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(concatenateStrings: (NSString*)string1
                                with: (NSString*)string2
                            callback: (RCTResponseSenderBlock)callback)
{
  NSString* string3 = SampleConcatenateStrings(string1, string2);

  NSArray *stringArray = @[string3];
  callback(stringArray);
}

@end
